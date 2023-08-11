import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts', // 打包入口
            formats: ['es'], // 指定打包模式为 es
            fileName: (format) => `index.${format}.js` // es 模式打包文件名为 index.es.js 
        },
        outDir: 'lib'
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
          }
    },
    
    server:{
        // proxy:{
        //     '/api': {
        //         target: '',
                
        //     }
        // }
    }
})