// AI服务接口定义
export interface AIProvider {
  generateImage(prompt: string, image?: File, mode?: StyleTransferMode): Promise<string>;
  isAvailable(): boolean;
}

// 风格转换模式
export type StyleTransferMode = 'recreate' | 'transfer';

// 风格转换请求参数
export interface StyleTransferRequest {
  image: File;
  style: string;
  stylePrompt: string;
  mode: StyleTransferMode; // 新增模式选择
}

// 风格转换响应
export interface StyleTransferResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  processingTime?: number;
}

// Hugging Face API配置
const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;

// 使用专门的图片风格转换模型
const STYLE_TRANSFER_MODELS = {
  // 真正的风格转换模型
  controlnet: 'lllyasviel/sd-controlnet-canny',
  instruct_pix2pix: 'timbrooks/instruct-pix2pix',
  // Flux作为备用（文本生成）
  flux: 'black-forest-labs/FLUX.1-schnell'
};

// Replicate API配置（预留）
const REPLICATE_TOKEN = import.meta.env.VITE_REPLICATE_TOKEN;

// 将文件转换为base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // 移除data:image/...;base64,前缀
      resolve(base64.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

// 图片风格处理API实现
class HuggingFaceProvider implements AIProvider {
  async generateImage(prompt: string, image?: File, mode: StyleTransferMode = 'recreate'): Promise<string> {
    if (!HF_TOKEN) {
      throw new Error('Hugging Face API token not configured');
    }

    if (!image) {
      // 如果没有图片，使用Flux进行文本到图像生成
      return this.generateTextToImage(prompt);
    }

    // 根据模式选择处理方式
    if (mode === 'transfer') {
      // 真实风格转换模式
      return this.performRealStyleTransfer(prompt, image);
    } else {
      // 艺术重创模式
      return this.performArtisticRecreation(prompt, image);
    }
  }

  // 真实风格转换实现（保持原图结构）
  private async performRealStyleTransfer(prompt: string, image: File): Promise<string> {
    // 尝试使用InstuctPix2Pix模型进行真正的图片编辑
    try {
      console.log('Attempting real style transfer with InstructPix2Pix');
      return await this.useInstructPix2Pix(prompt, image);
    } catch (error) {
      console.warn('InstructPix2Pix failed, trying ControlNet approach:', error);
      
      try {
        return await this.useControlNet(prompt, image);
      } catch (controlNetError) {
        console.warn('ControlNet failed, this mode requires specialized models');
        throw new Error('真实风格转换模式暂时不可用，请尝试艺术重创模式或稍后重试');
      }
    }
  }

  // AI艺术创作实现（基于图片内容和用户描述创作）
  private async performArtisticRecreation(prompt: string, image: File): Promise<string> {
    console.log('Using AI artistic creation mode');
    
    try {
      // 分析图片内容
      const imageDescription = await this.analyzeImage(image);
      
      // 结合图片分析和用户描述
      const combinedPrompt = `Based on this image: ${imageDescription}. Create: ${prompt}. High quality, detailed, artistic masterpiece.`;
      
      console.log('Combined prompt for artistic creation:', combinedPrompt);

      // 使用Flux生成艺术作品
      const response = await fetch(`https://api-inference.huggingface.co/models/${STYLE_TRANSFER_MODELS.flux}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: combinedPrompt,
          parameters: {
            guidance_scale: 3.5,
            num_inference_steps: 4,
            max_sequence_length: 256,
            width: 1024,
            height: 1024
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Artistic creation failed: ${errorText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
      
    } catch (error) {
      console.error('Artistic creation error:', error);
      throw error;
    }
  }

  // 使用InstructPix2Pix进行图片编辑（真正的风格转换）
  private async useInstructPix2Pix(prompt: string, image: File): Promise<string> {
    const apiUrl = `https://api-inference.huggingface.co/models/${STYLE_TRANSFER_MODELS.instruct_pix2pix}`;
    const base64Image = await fileToBase64(image);

    // InstructPix2Pix使用指令式提示词
    const instruction = `Transform this image to ${prompt} style while keeping the same composition and subject`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: base64Image,
          prompt: instruction
        },
        parameters: {
          num_inference_steps: 20,
          image_guidance_scale: 1.5,
          guidance_scale: 7.5
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`InstructPix2Pix failed: ${errorText}`);
    }

    const blob = await response.blob();
    if (blob.size === 0 || !blob.type.startsWith('image/')) {
      throw new Error('InstructPix2Pix returned invalid response');
    }

    console.log('InstructPix2Pix style transfer successful');
    return URL.createObjectURL(blob);
  }

  // 使用ControlNet进行风格转换
  private async useControlNet(prompt: string, image: File): Promise<string> {
    const apiUrl = `https://api-inference.huggingface.co/models/${STYLE_TRANSFER_MODELS.controlnet}`;
    const base64Image = await fileToBase64(image);

    const stylePrompt = `${prompt} style, artistic transformation, high quality`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          prompt: stylePrompt,
          image: base64Image
        },
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
          controlnet_conditioning_scale: 1.0
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ControlNet failed: ${errorText}`);
    }

    const blob = await response.blob();
    if (blob.size === 0 || !blob.type.startsWith('image/')) {
      throw new Error('ControlNet returned invalid response');
    }

    console.log('ControlNet style transfer successful');
    return URL.createObjectURL(blob);
  }

  // 使用Flux进行文本到图像生成
  private async generateTextToImage(prompt: string): Promise<string> {
    const apiUrl = `https://api-inference.huggingface.co/models/${STYLE_TRANSFER_MODELS.flux}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          guidance_scale: 3.5,
          num_inference_steps: 4,
          max_sequence_length: 256,
          width: 1024,
          height: 1024
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Flux text-to-image failed: ${errorText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  // 备用方案：通过文本描述实现风格转换
  private async generateImageWithTextDescription(prompt: string, image: File): Promise<string> {
    try {
      // 使用图像分析来生成描述，然后结合风格
      const imageDescription = await this.analyzeImage(image);
      const combinedPrompt = `${imageDescription} in ${prompt} style, artistic transformation, high quality, detailed`;
      
      console.log('Using text-based approach with prompt:', combinedPrompt);

      const response = await fetch(FLUX_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: combinedPrompt,
          parameters: {
            guidance_scale: 3.5,
            num_inference_steps: 4,
            max_sequence_length: 256,
            width: 1024,
            height: 1024
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Backup method failed: ${response.status}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
      
    } catch (error) {
      throw new Error(`Both primary and backup methods failed: ${error}`);
    }
  }

  // 使用图像描述模型分析上传的图片
  private async analyzeImage(image: File): Promise<string> {
    try {
      // 使用Hugging Face的图像描述模型
      const imageAnalysisUrl = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large';
      const base64Image = await fileToBase64(image);

      const response = await fetch(imageAnalysisUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: base64Image
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result[0] && result[0].generated_text) {
          const description = result[0].generated_text;
          console.log('Image analysis result:', description);
          return description;
        }
      }
      
      // 如果图像分析失败，使用基于文件名的简单描述
      console.warn('Image analysis failed, using filename-based description');
      return this.getSimpleDescription(image);
      
    } catch (error) {
      console.warn('Image analysis error:', error);
      return this.getSimpleDescription(image);
    }
  }

  // 基于文件名的简单描述（备用方案）
  private getSimpleDescription(image: File): string {
    const fileName = image.name.toLowerCase();
    
    if (fileName.includes('portrait') || fileName.includes('face') || fileName.includes('person')) {
      return 'a portrait of a person';
    } else if (fileName.includes('landscape') || fileName.includes('nature') || fileName.includes('scenery')) {
      return 'a beautiful landscape scene';
    } else if (fileName.includes('building') || fileName.includes('architecture') || fileName.includes('house')) {
      return 'architectural structure';
    } else if (fileName.includes('animal') || fileName.includes('cat') || fileName.includes('dog') || fileName.includes('pet')) {
      return 'an animal';
    } else if (fileName.includes('flower') || fileName.includes('plant') || fileName.includes('garden')) {
      return 'flowers and plants';
    } else if (fileName.includes('car') || fileName.includes('vehicle') || fileName.includes('transport')) {
      return 'a vehicle';
    } else if (fileName.includes('food') || fileName.includes('meal') || fileName.includes('dish')) {
      return 'food and cuisine';
    } else {
      return 'a detailed scene with various elements';
    }
  }

  isAvailable(): boolean {
    return !!HF_TOKEN;
  }
}

// Replicate API实现（预留）
class ReplicateProvider implements AIProvider {
  async generateImage(prompt: string, image?: File, mode: StyleTransferMode = 'recreate'): Promise<string> {
    if (!REPLICATE_TOKEN) {
      throw new Error('Replicate API token not configured');
    }

    // TODO: 实现Replicate API调用
    // 这里可以根据mode选择不同的Replicate模型
    if (mode === 'transfer') {
      // 使用专业的风格转换模型
      throw new Error('Replicate style transfer not implemented yet');
    } else {
      // 使用图像重创模型
      throw new Error('Replicate artistic recreation not implemented yet');
    }
  }

  isAvailable(): boolean {
    return !!REPLICATE_TOKEN;
  }
}

// 创建AI提供者实例
const huggingFaceProvider = new HuggingFaceProvider();
const replicateProvider = new ReplicateProvider();

// 获取可用的AI提供者
export const getAvailableProvider = (): AIProvider => {
  // 优先使用Replicate，如果不可用则使用Hugging Face
  if (replicateProvider.isAvailable()) {
    return replicateProvider;
  } else if (huggingFaceProvider.isAvailable()) {
    return huggingFaceProvider;
  } else {
    throw new Error('No AI provider is available. Please configure API tokens.');
  }
};

// 主要的风格处理函数
export const processStyleTransfer = async (
  request: StyleTransferRequest
): Promise<StyleTransferResponse> => {
  const startTime = Date.now();
  
  try {
    const provider = getAvailableProvider();
    
    // 构建完整的提示词
    const fullPrompt = `${request.stylePrompt}, high quality, detailed, artistic`;
    
    // 调用AI服务，传入模式参数
    const imageUrl = await provider.generateImage(fullPrompt, request.image, request.mode);
    
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      imageUrl,
      processingTime
    };
    
  } catch (error) {
    console.error('Style processing error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// 检查API配置状态
export const checkAPIStatus = () => {
  return {
    huggingFace: huggingFaceProvider.isAvailable(),
    replicate: replicateProvider.isAvailable(),
    hasAnyProvider: huggingFaceProvider.isAvailable() || replicateProvider.isAvailable()
  };
};