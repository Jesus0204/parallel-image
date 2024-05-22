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
   
2. Node Library: The other option is to use a small library that supports Node JS to process the images in parallel. Before explaining what the library does, it is important to mention how Javascript works. Geeks for Geeks (2024) mentions that Javascript only works with one thread at a time. This means it uses Serial Computing, working one task at a time and waiting until it is finished to go to the next, so on native Javascript there is no way to run parallel programs. And because of the single-threaded nature of Node, it is faster than a lot of languages in non-CPU-intensive tasks. However, since image processing is CPU-intensive, using a library to run the code in parallel is the other option. 

### Solution selected
Both options let me implement the solution using the Parallel Programming Paradigm, so both are good solutions. So which one do I pick? After reading how to implement both, and the complexity that each one requires I decided to use a Node JS library. Using WebAssembly is not that complex, but for this project, I would have to use WeAssemply with the Open MP API, which increments the complexity. I don't have experience using WebAssembly, and the learning curve is too big for the benefits that it gives. Since both provide access to multiple cores and I am going to use the library on the server side (so there is no browser overhead and to use the better hardware), using a library seems like the obvious and best solution. It keeps my web application on pure Javascript, it is easier to code and runs almost as fast as WebAssembly. Additionally, using WebAssembly would require compiling code, which makes the whole process of converting the image one step longer. Taking all of this into account, it is the natural solution to implement this project. 

## Selected Node JS Library 
Having selected the method, now the library has to be selected. After researching possible libraries, there are three that fit the project well:
1. Parallel JS
2. Worker Threads
3. Cluster

Let's dive into how each library works, and based on this select the best. 

### Parallel JS
The Parallel JS Documentation states that when using Node, the library uses child processes. But what are Child Processes? According to Geeks for Geeks (2024), a child process can create additional threads. Now, I had mentioned that Parallel programming is running a single task on multiple CPUs, but here it seems like new threads will be created for every task. In reality, I will only have two threads. The first one is the main Javascript thread where the web application is running. The beauty of Parallel JS is that it leaves this thread alone, so the whole of the application can run smoothly. If this thread was given to execute the task, the web app would likely crash, so it is important to leave this thread alone. The other thread would be the one that processes the image with parallel programming. 

Using the Parallel(data, opts) constructor, it takes the data for the parallel Job. You can also set the maximum number of workers, which by default is the number of cores that the computer has. After creating the job, the map function is used, where Parallel JS will spawn one worker for each element in the data array that you previously passed. If the data has more elements than workers, it will use the maxWorkers argument. This means that if all my CPUs are available, it will spawn one worker for the first 10 elements, and when any task is finished give a new worker to the next element in the data.

### Worker threads
Anto (2022) talks about how Node JS is great because of its single-threaded nature to handle I/O (input-output operations). It does this because the architecture has the libuv library, which helps handle the asynchronous code. Whenever "the Event Loop encounters code that must be executed asynchronously (e.g., accessing the file system, making network calls, and other I/O operations), instead of executing the code on its own, it delegates it to a pool of threads and moves on to executing the remainder of the program. The threads then parallelly execute the asynchronous code and return an event to the Event Loop once done". This is great, but the problem is that CPU-intensive operations are executed by the Event Loop, so they would take a long time to execute. 

Here are where worker threads come in handy. "A worker thread runs a piece of code as instructed by the parent thread in isolation from the parent and other worker threads. Each worker thread has its own isolated V8 environment, event loop, event queue, etc" (Anto, 2022). A pool of worker threads can be created to execute parallel tasks. A new worker can be created for each part of the tasks, and using a promise, we can wait for all the workers to finish their job. Anto (2022) mentions a library called Piscina, which is a pooling library that helps you manage all the workers. 

### Cluster
Rehman (2023), mentions that "Clustering in Node.js involves creating multiple worker processes that share the incoming workload. Each worker process runs in its event loop, utilizing the available CPU cores. The master process manages the worker processes, distributes incoming requests, and handles process failures". Even though it uses multiple workers to share the workload (which is essentially what Parallelism is) it is important to note here the keyword **request**. After asking ChatGTP how the cluster library works OpenAI mentioned cluster "is primarily used for creating a master-worker architecture to utilize multiple CPU cores, which is more suitable for handling multiple requests concurrently rather than parallelizing individual tasks". Image processing does not deal with handling multiple requests so even though parallelism is used, this is not a good fit for my project. 

### Best option
I already mentioned why the Cluster library is not a good option, so of Parallel JS and Worker threads which is better? To be honest, the Parallel JS library looked to me the easiest to implement, and on paper, it was a great library. Yet after implementing the project with the map function, the image took over a minute to process. I researched online and found that the quality of the library was poor and that it did not handle overhead properly (since I am dealing with millions of pixels). Even though the library has another method called spawn that I could use to create the workers, I decided to not use the library based on my initial findings. Because of this, the worker threads library was the best option for my project. 

## Model
To make the program flexible, I will use the number of cores that every computer has and create that amount of workers. This is done with the following line of code using the os library: 
```Javascript
numOfThreads_CPU = os.cpus().length;;
```
Considering that my Computer has 10 cores (M1 Pro Silicon Apple Chip) the program execution will look like the following diagram: 
[].

## References
Anto. (February 28, 2022). Parallel processing in Node.js using worker threads. https://deepsource.com/blog/nodejs-worker-threads

Geeks for Geeks. (June 4, 2021). Introduction to Parallel Computing. https://www.geeksforgeeks.org/introduction-to-parallel-computing/ 

Geeks for Geeks. (January 18, 2024). Node Child Processing. https://www.geeksforgeeks.org/node-js-child-process/

OpenMP. (n.d.). The OpenMP API specification for parallel programming. https://www.openmp.org/resources/tutorials-articles/

Parallel JS. (n.d.). Easy multi-core processing with javascript. https://parallel.js.org/

Rehman, A. (July 17, 2023). Implementing Node.js Cluster for Improved Performance. https://medium.com/@mjdrehman/implementing-node-js-cluster-for-improved-performance-f800146e58e1

Steiner, T. (June 29, 2023). What is WebAssembly and where did it come from?. https://web.dev/articles/what-is-webassembly

Vistorskyte, I. (July 1, 2021). Concurrency vs Parallelism: The Main Differences. https://oxylabs.io/blog/concurrency-vs-parallelism
