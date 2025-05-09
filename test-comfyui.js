const axios = require('axios');

// Configuration
const config = {
    comfyuiUrl: process.env.COMFYUI_URL || 'http://host.docker.internal:8188',
    apiEndpoint: '/api',
    ollamaUrl: process.env.OLLAMA_URL || 'http://host.docker.internal:11434',
    timeout: 5000 // 5 second timeout for basic connectivity test
};

async function testComfyUI() {
    try {
        const apiUrl = `${config.comfyuiUrl}${config.apiEndpoint}`;
        console.log('Testing AI Services API at:', apiUrl);

        // Get system stats
        console.log('\nChecking system stats...');
        const systemStats = await axios.get(`${apiUrl}/system_stats`, {
            timeout: config.timeout
        });
        console.log('System Information:');
        console.log('- ComfyUI Version:', systemStats.data.system.comfyui_version);
        console.log('- Python Version:', systemStats.data.system.python_version);
        console.log('- PyTorch Version:', systemStats.data.system.pytorch_version);
        console.log('\nGPU Information:');
        systemStats.data.devices.forEach(device => {
            console.log(`- ${device.name}`);
            console.log(`  VRAM Total: ${Math.round(device.vram_total / 1024 / 1024 / 1024)}GB`);
            console.log(`  VRAM Free: ${Math.round(device.vram_free / 1024 / 1024 / 1024)}GB`);
        });

        // Get object info
        console.log('\nChecking available models and operations...');
        const models = await axios.get(`${apiUrl}/object_info`, {
            timeout: config.timeout
        });
        const modelList = Object.keys(models.data);
        console.log(`Found ${modelList.length} available models and operations`);
        console.log('\nSome key operations available:');
        const keyOperations = [
            'KSampler',
            'CheckpointLoaderSimple',
            'CLIPTextEncode',
            'VAEDecode',
            'EmptyLatentImage',
            'SaveImage'
        ];
        keyOperations.forEach(op => {
            if (modelList.includes(op)) {
                console.log(`- ${op}`);
            }
        });

        console.log('\nTest completed successfully!');
        console.log('AI Services API is working correctly.');
    } catch (error) {
        console.error('Could not connect to AI Services. Is it running? Make sure the services are running and accessible from WSL.');
        process.exit(1);
    }
}

// Check for command line arguments
if (process.argv.length > 2) {
    config.comfyuiUrl = process.argv[2];
}

// Run the test
testComfyUI(); 