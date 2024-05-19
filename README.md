# Evidence: 4 Parallel Programming Paradigm
Jesús Alejandro Cedillo Zertuche A01705442

## Context
Since the beginning of computing, the method that has been used is Serial computing. Geeks For Geeks (2021) mentions that an algorithm divides a problem into small instructions that are given to the central processing unit one by one. The important thing to note here is that the next one starts to process only after one instruction is finished. A good comparison is a line where there is only one cashier, so they can only give tickets to one person at a time. This was a big problem since the hardware was being wasted by only using one part of its power. 

This is why parallel computing was thought of as where "problems are broken down into instructions and are solved concurrently as each resource that has been applied to work is working at the same time" (Geeks for Geeks, 2021). 

Now before I explain my project there is something important to note here. In the previous sentence, I used the word concurrent, and Concurrent programming is not the same as Parallel programming. Nowadays, computers have multiple cores or CPUs. Vistorskyte (2021) mentions the following definition: "Concurrency is when multiple tasks can run in overlapping periods. It’s an illusion of multiple tasks running in parallel because of a very fast switching by the CPU. Two tasks can’t run at the same time on a single-core CPU. Parallelism is when tasks run in parallel in multiple CPUs [or cores].

This means that concurrency is multiple tasks over a single CPU, while parallelism is running a single task using several CPUs or cores. 

## Description
Considering this, I implemented a small web app using parallel programming. On the small website, you can upload an image, and transform the image to one of the following:

1. blur
2. greyscale
3. sepia
4. invert

Image processing is a very expensive program to run since every pixel of the image has to be transformed depending on what was selected. Common images have 2048 pixels in width and 1536 in height, which means that the total of pixels is 3,145,728. And this isn't even a high-quality image, where the pixel count could increase to 25,000,000 pixels. To apply the "filters" to the images more efficiently, parallel programming would cut the time considerably, and take advantage of the full resources of the CPU. 

## Parallel JS Library
I am developed a small website using Node JS. Other languages (like C++) have an API called Open MP. What Open MP does is create threads to parallelize for loops, taking full advatnge of the cores available. Open MP uses pragmas to tell the compiler which of the code needs to be parallelized. Now, while Open MP is very simple to use in C++, it doesn't offer Javascript support. I only know how to program Web Aplications in Javascript, so initially this seemed like a problem. After researching how to use Javascript to solve this problem, I found two available options: 

1. Using WebAssembly
2. Using Parallel JS

## References
Geeks for Geeks. (June 4, 2021). Introduction to Parallel Computing. https://www.geeksforgeeks.org/introduction-to-parallel-computing/ 

OpenMP. (n.d.). The OpenMP API specification for parallel programming. https://www.openmp.org/resources/tutorials-articles/

Vistorskyte, I. (July 1, 2021). Concurrency vs Parallelism: The Main Differences. https://oxylabs.io/blog/concurrency-vs-parallelism
