import React, { Component } from 'react';
import {mat4} from 'gl-matrix';

class Example1 extends Component {
    render() {
        return (
            <div>
            <canvas id='webglCanvas' width="640" height="480">
                Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.
            </canvas>
            </div>
        );
    }
    main() {
        const canvas = document.querySelector('#webglCanvas')
        const gl = canvas.getContext('webgl')

        const vsSource = `
            attribute vec4 aVertexPosition;
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            void main() {
                gl_Position = uModelViewMatrix * uProjectionMatrix * aVertexPosition;
            }
        `
        const fsSource = `
            void main() {
                gl_FragColor = vec4(1.0,1.0,1.0,1.0);
            }
        `
        const shaderProgram = this.initShaderProgram(gl, vsSource, fsSource);
        const buffers = this.initBuffer(gl)

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };

        this.drawScene(gl, programInfo, buffers)

    }
    drawScene(gl, programInfo, buffers) {
        gl.clearColor(0.0,0.0,0.0,1)
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        const zNear = 0.1
        const zFar = 100.0
        const projectionMatrix = mat4.create()

        mat4.perspective(projectionMatrix,fieldOfView,aspect,zNear,zFar)

        const modelViewMatrix = mat4.create()
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0])

        {
            const numComponents = 2; // pull out 2 values per iteration
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set of values to the next
            const offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        gl.useProgram(programInfo.program)

        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix,false,projectionMatrix)
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,false,modelViewMatrix)

        {
            const offset = 0
            const vertexCount = 4
            gl.drawArrays(gl.TRIANGLE_STRIP,offset,vertexCount)
        }
    }
    // 初始化着色器程序
    initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = this.getShader(gl,gl.VERTEX_SHADER,vsSource)
        const fragmentShader = this.getShader(gl,gl.FRAGMENT_SHADER,fsSource)
         // 创建着色器程序
        const shaderProgram = gl.createProgram()
        gl.attachShader(shaderProgram,vertexShader)
        gl.attachShader(shaderProgram,fragmentShader)
        gl.linkProgram(shaderProgram)

        // 创建失败， alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }
    // 创建指定类型的着色器，上传source源码并编译
    getShader(gl,type,source) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader,source)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader
    }

    // 创建缓冲器存储顶点
    initBuffer(gl) {
        // Create a buffer for the square's positions.
        let squarePosition = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, squarePosition)
        let vertices =[
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0
        ]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

        return {
            position: squarePosition
        }
    }
    componentDidMount() {
        this.main()
    }
}


export default Example1;