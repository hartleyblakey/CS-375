use std::{borrow::Cow};
use winit::{
    event::{Event, WindowEvent},
    event_loop::EventLoop,
    window::Window,
};

#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct FrameUniforms {
    res:    [u32;2],
    frame:  u32,
    time:   f32,
}

mod gpu;
use gpu::*;


struct Context {
    screen_pipeline:        wgpu::RenderPipeline,
    raytrace_pipeline:      wgpu::ComputePipeline,

    triangles_ssbo:         wgpu::Buffer,
    bvh_ssbo:               wgpu::Buffer,
    screen_ssbo:            wgpu::Buffer,

    rt_data_binding:        wgpu::BindGroup,

    frame_uniforms_binding: wgpu::BindGroup,
    frame_uniforms_buffer:  wgpu::Buffer,
    frame_uniforms:         FrameUniforms,
}

struct BGBuilder<'a> {
    layout_entries: Vec<wgpu::BindGroupLayoutEntry>,
    entries:        Vec<wgpu::BindGroupEntry<'a>>,
}


// struct BufferView {
//     ty: wgpu::BufferBindingType,
//     dynamic_offset_stride: Option<NonZero<u32>>,
//     offset: u32,
//     size: u32
// }

impl<'a> BGBuilder<'a> {
    fn new() -> BGBuilder<'a> {
        BGBuilder {
            layout_entries: Vec::new(),
            entries:        Vec::new(),
        }
    }

    fn with_buffer(&mut self, buffer: &'a wgpu::Buffer, visibility: wgpu::ShaderStages) -> &mut Self{
        let ty : wgpu::BufferBindingType = match buffer.usage() {
            _ if buffer.usage().contains(wgpu::BufferUsages::UNIFORM)  => wgpu::BufferBindingType::Uniform,
            _ if buffer.usage().contains(wgpu::BufferUsages::STORAGE)  => wgpu::BufferBindingType::Storage { read_only: false },
            _ => panic!("Invalid buffer usage: expected uniform or storage"),
        };

        let layout_entry = wgpu::BindGroupLayoutEntry {
            binding: self.layout_entries.len() as u32,
            count: None,
            visibility,
            ty: wgpu::BindingType::Buffer { ty, has_dynamic_offset: false, min_binding_size: None }
        };

        self.layout_entries.push(layout_entry);

        let entry = wgpu::BindGroupEntry {
            binding: self.entries.len() as u32,
            resource: wgpu::BindingResource::Buffer(buffer.as_entire_buffer_binding()),
        };
        self.entries.push(entry);
        self
    }


    fn finish(&self, device: &wgpu::Device) -> (wgpu::BindGroup, wgpu::BindGroupLayout) {
        let layout_desc = wgpu::BindGroupLayoutDescriptor {
            label: None,
            entries: self.layout_entries.as_slice(),
        };
        let layout = device.create_bind_group_layout(&layout_desc);
        
        let desc = wgpu::BindGroupDescriptor {
            label: None,
            layout: &layout,
            entries: self.entries.as_slice(),
        };

        (device.create_bind_group(&desc), layout)
    }
}




impl Context {
    fn init(gpu: &Gpu) -> Context {

        let u_frame_0 = FrameUniforms {
            frame: 0,
            res: [512, 512],
            time: 0.0
        };

        let u_frame_buffer = gpu.new_uniform_buffer(&u_frame_0).raw;

        let (u_frame_binding, u_frame_layout) = BGBuilder::new()
            .with_buffer(&u_frame_buffer, wgpu::ShaderStages::all())
            .finish(&gpu.device);

        let buffer_size_mb = 128;

        let triangles_ssbo =    gpu.new_storage_buffer(buffer_size_mb * 1024 * 1024).raw;
        let bvh_ssbo =          gpu.new_storage_buffer(buffer_size_mb * 1024 * 1024).raw;
        let screen_ssbo =       gpu.new_storage_buffer(512 * 512 * 4 * 4).raw;

        let (rt_data_binding, rt_data_layout) = BGBuilder::new()
            .with_buffer(&triangles_ssbo, wgpu::ShaderStages::COMPUTE | wgpu::ShaderStages::FRAGMENT)
            .with_buffer(&bvh_ssbo,       wgpu::ShaderStages::COMPUTE | wgpu::ShaderStages::FRAGMENT)
            .with_buffer(&screen_ssbo,    wgpu::ShaderStages::COMPUTE | wgpu::ShaderStages::FRAGMENT)
            .finish(&gpu.device);


        // Load the shaders from disk
        let shader = gpu.device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: None,
            source: wgpu::ShaderSource::Wgsl(Cow::Borrowed(include_str!("shader.wgsl"))),
        });

        let screen_pipeline_layout = gpu.device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: None,
            bind_group_layouts: &[&u_frame_layout, &rt_data_layout],
            push_constant_ranges: &[],
        });

        let surface_capabilities = gpu.surface.get_capabilities(&gpu.adapter);
        let surface_format = surface_capabilities.formats[0];

        let screen_pipeline = gpu.device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: None,
            layout: Some(&screen_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &shader,
                entry_point: Some("vs_main"),
                buffers: &[],
                compilation_options: Default::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &shader,
                entry_point: Some("fs_main"),
                compilation_options: Default::default(),
                targets: &[Some(surface_format.into())],
            }),
            primitive: wgpu::PrimitiveState::default(),
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        let raytrace_pipeline_layout = gpu.device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor{
            label: Some("raytrace compute pipeline layout"),
            bind_group_layouts: &[&u_frame_layout, &rt_data_layout],
            push_constant_ranges: &[],
        });

        let raytrace_pipeline = gpu.device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("raytrace compute pipeline"),
            module: &shader,
            layout: Some(&raytrace_pipeline_layout),
            entry_point: Some("cs_main"),
            compilation_options: Default::default(),
            cache: None,
        });


        Context {
            screen_pipeline,
            frame_uniforms: FrameUniforms { res: [512, 512], frame: 0, time: 0.0 },
            frame_uniforms_buffer: u_frame_buffer,
            frame_uniforms_binding: u_frame_binding,
            
            raytrace_pipeline,
            screen_ssbo,
            bvh_ssbo,
            triangles_ssbo,
            rt_data_binding,
            
        }
    }
}

fn frame(gpu: &Gpu, ctx: &mut Context) {
    let surface_texture = gpu.surface.get_current_texture().expect("Failed to acquire next swap chain texture");
    let view = surface_texture.texture.create_view(&wgpu::TextureViewDescriptor::default());
    let mut encoder = gpu.device.create_command_encoder(&wgpu::CommandEncoderDescriptor {
            label: None,
        });

    let rpassdesc = wgpu::RenderPassDescriptor {
        label: None,
        color_attachments: &[Some(wgpu::RenderPassColorAttachment {
            view: &view,
            resolve_target: None,
            ops: wgpu::Operations {
                load: wgpu::LoadOp::Clear(wgpu::Color::GREEN),
                store: wgpu::StoreOp::Store,
            },
        })],
        depth_stencil_attachment: None,
        timestamp_writes: None,
        occlusion_query_set: None,
    };


    ctx.frame_uniforms.frame += 1;
    ctx.frame_uniforms.time += 1.0 / 60.0; // hack

    gpu.queue.write_buffer(&ctx.frame_uniforms_buffer, 0, bytemuck::bytes_of(&ctx.frame_uniforms));
    
    {
        let mut cpass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor::default());
        cpass.set_pipeline(&ctx.raytrace_pipeline);
        cpass.set_bind_group(0, &ctx.frame_uniforms_binding, &[]);
        cpass.set_bind_group(1, &ctx.rt_data_binding, &[]);
        cpass.dispatch_workgroups(64, 64, 1);
    }

    {
        let mut rpass = encoder.begin_render_pass(&rpassdesc);
        rpass.set_pipeline(&ctx.screen_pipeline);
        rpass.set_bind_group(0, Some(&ctx.frame_uniforms_binding), &[]);
        rpass.set_bind_group(1, Some(&ctx.rt_data_binding), &[]);
        rpass.draw(0..3, 0..1);
    }

    gpu.queue.submit(Some(encoder.finish()));
    surface_texture.present();
}

async fn run() {
    let event_loop = EventLoop::new().unwrap();
    let window = new_window(&event_loop);
    let mut gpu = Gpu::new(&window).await;
    let mut ctx = Context::init(&gpu);
    event_loop.run(
    move |event, target| {

        if let Event::WindowEvent {
            window_id: _,
            event,
        } = event
        {
            match event {
                WindowEvent::Resized(new_size) => {
                    // Reconfigure the surface with the new size
                    gpu.surface_config.width = new_size.width.max(1);
                    gpu.surface_config.height = new_size.height.max(1);
                    gpu.surface_config.width = gpu.surface_config.width.min(4096);
                    gpu.surface_config.height = gpu.surface_config.height.min(4096);

                    gpu.surface.configure(&gpu.device, &gpu.surface_config);
                    // On macos the window needs to be redrawn manually after resizing
                    gpu.window.request_redraw();
                }
                WindowEvent::RedrawRequested => {
                    gpu.window.request_redraw();
                    frame(&gpu, &mut ctx);
                }
                WindowEvent::CloseRequested => target.exit(),
                _ => {}
            };
        }
    })
    .unwrap();
}
pub fn main() {
        {
            #[cfg(not(target_arch = "wasm32"))]
            env_logger::init();
            #[cfg(not(target_arch = "wasm32"))]
            pollster::block_on(run())
        };
        
        {
            #[cfg(target_arch = "wasm32")]
            console_log::init().expect("could not initialize logger");
            #[cfg(target_arch = "wasm32")]
            wasm_bindgen_futures::spawn_local(run().await);
        };
}