# Evidence: 4 Parallel Programming Paradigm
Jesús Alejandro Cedillo Zertuche A01705442

## Context
Since the beginning of computing, the method that has been used is Serial computing. Geeks For Geeks (2021) mentions that an algorithm divides a problem into small instructions that are given to the central processing unit one by one. The important thing to note here is that the next one starts to process only after one instruction is finished. A good comparison is a line where there is only one cashier, so they can only give tickets to one person at a time. This was a big problem since the hardware was being wasted by only using one part of its power. 

This is why parallel computing was thought of as where "problems are broken down into instructions and are solved concurrently as each resource that has been applied to work is working at the same time" (Geeks for Geeks, 2021). 

Now before I explain my project there is something important to note here. In the previous sentence, I used the word concurrent, and Concurrent programming is not the same as Parallel programming. Nowadays, computers have multiple cores or CPUs. Vistorskyte (2021) mentions the following definition: "Concurrency is when multiple tasks can run in overlapping periods. It’s an illusion of multiple tasks running in parallel because of a very fast switching by the CPU. Two tasks can’t run at the same time on a single-core CPU. Parallelism is when tasks run in parallel in multiple CPUs [or cores].

This means that concurrency is multiple tasks over a single CPU, while parallelism is running a single task using several CPUs or cores. 

## Description
Considering this, I implemented a small web app using parallel programming. On the small website, you can upload an image, and transform the image into one of the following:

1. blur
2. greyscale
3. sepia
4. invert

Image processing is a very expensive program to run since every pixel of the image has to be transformed depending on what was selected. Common images have 2048 pixels in width and 1536 in height, which means that the total of pixels is 3,145,728. And this isn't even a high-quality image, where the pixel count could increase to 25,000,000 pixels. To apply the "filters" to the images more efficiently, parallel programming would cut the time considerably, and take advantage of the full resources of the CPU. 

## Implementation Method
I developed a small website using Node JS. Other languages (like C++) have an API called Open MP. What Open MP does is create threads to parallelize for loops, taking full advantage of the cores available. Open MP uses pragmas to tell the compiler which of the code needs to be parallelized. Now, while Open MP is very simple to use in C++, it doesn't offer Javascript support. I only know how to program Web Applications in Javascript, so initially this seemed like a problem. After researching how to use Javascript to parallelize, I found two available solutions: 

1. WebAssembly: According to Steiner (2023), "WebAssembly is a low-level assembly-like language with a compact binary format that runs with near-native performance and provides languages such as C/C++ and Rust, and many more with a compilation target so that they run on the web". Steiner (2023) also mentions "In practice, most Wasm engines compile the Wasm bytecode to machine code and then execute that". This would mean that I would be able to write the function to parallelize images in C++ with the Open MP API, and then using WebAssembly compile the code so it could be run on the webpage. Since the .wasm extension is not that human-friendly, another compiler exists called Emscripten, which would let me compile the C++ code directly. In a nutshell, the parallelized function would be in C++, while the rest would be in Javascript.
   
2. Parallel JS: The other option is to use a small library that supports Node JS to process the images in parallel. Before explaining what the library does, it is important to mention how Javascript works. Geeks for Geeks (2024) mentions that Javascript only works with one thread at a time. This would essentially mean that it uses Serial Computing, working one task at a time and waiting until it is finished to go to the next. This means that on native Javascript there is no way to run parallel programs. This is where Parallel JS comes in. Using WebWorkers for the Browser, and Child Processes for Node gives you access to "high-level access to multi-core processing" (Parallel JS, n.d.), thus enabling the option to process the images using functions of the library.

### Solution selected
Both options let me implement the solution using the Parallel Programming Paradigm, so both are good solutions. So which one do I pick? After reading how to implement both, and the complexity that each one requires I decided to use the Parallel JS library. Using WebAssembly is not that complex, but for this project, I would have to use WeAssemply with the Open MP API, which increments the complexity. I don't have experience using WebAssembly, and the learning curve is too big for the benefits that it gives. Since both give me access to multiple cores and I am going to use Parallel JS on the server side (so there is no browser overhead and to use the better hardware), using the library seems like the obvious and best solution. It keeps my web application on pure Javascript, it is easier to code and runs almost as fast as WebAssembly. Additionally, using WebAssembly would require compiling code, which makes the whole process of converting the image one step longer. Taking all of this into account, it is the natural solution to implement this project. 

## Parallel JS Library
Having selected the method, I am now going to explain how the Parallel JS Library works.

## References
Geeks for Geeks. (June 4, 2021). Introduction to Parallel Computing. https://www.geeksforgeeks.org/introduction-to-parallel-computing/ 

Geeks for Geeks. (January 18, 2024). Node Child Processing. https://www.geeksforgeeks.org/node-js-child-process/

OpenMP. (n.d.). The OpenMP API specification for parallel programming. https://www.openmp.org/resources/tutorials-articles/

Parallel JS. (n.d.). Easy multi-core processing with javascript. https://parallel.js.org/

Steiner, T. (June 29, 2023). What is WebAssembly and where did it come from?. https://web.dev/articles/what-is-webassembly

Vistorskyte, I. (July 1, 2021). Concurrency vs Parallelism: The Main Differences. https://oxylabs.io/blog/concurrency-vs-parallelism
