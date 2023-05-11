
# Quickdream
Quickdream is a full-stack social media app created to explore the capabilities of AI image generation and OpenAI's public API in general. Users are able to enter a prompt and have an image generated based on that prompt. These images are then shared on the Quickdream platform, where users can follow each other, like and comment on images, and discover new and interesting prompts to try. 

**The app has just entered the minimum viable product stage, so some promised features may be absent at the moment.** 

<p align="center">
<img src="quickdream-demo.gif" alt="Demo of the Quickdream site">
</p>

[![Netlify Status](https://api.netlify.com/api/v1/badges/b3d0599e-49d2-4be3-a0f7-158f16bd0110/deploy-status)](https://app.netlify.com/sites/quickdream/deploys) [![Railway - Offline](https://img.shields.io/static/v1?label=Railway&message=Offline&color=%230B0D0E&logo=railway)](https://quickdream-production.up.railway.app/)


**Link to project:** https://quickdream.netlify.app/

**Thursday, May 11:**

> *Quickdream's backend is iteratively migrating from a deprecated hosting environment to Railway, so authentication and image generation will not work for a few days.*
## How It's Made:

**Tech used:** HTML, CSS, JavaScript, React, Vite, MUI, Express, MongoDB


The front end is created with `React`, `MUI`, and `CSS`. `MUI` was mainly used for form inputs, buttons, and icons.
The back end uses `Express` as the foundation for the server, and `MongoDB` + `Mongoose` for storing the application's data, while
`bcrypt` is used to hash/salt user passwords before being stored in the database. The `OpenAI` API library is used to generate images from a prompt that are then uploaded to `cloudinary` and stored.
Lastly, after signing up, users are given a default user avatar that is generated by the `identicon` package dynamically based on their username.
Authentication is handled by the `Passport` local strategy.
## Lessons Learned:
I approached this project with a new methodology in mind. Rather than ideating and designing pages or components, I started the design process by thinking of the features I wanted to include in the project, and designing the application around them. After I had a rough wireframe, I developed in cycles, tweaking a feature's design, developing the feature, tweaking the next feature's design, developing the next feature. 

This feature-first approach has been tremendously helpful in keeping me focused and my ideas grounded. Following this approach, I only create components or new pages when a certain feature warrants them. This is in contrast to my usual practice of building components I think I'll need and then later shoving them into the app somewhere just so they don't go to waste.

This approach also helped create a clear, linear path of development, as it was easy to rank features by their criticality and prioritize building the most critical features first.