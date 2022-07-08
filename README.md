# Unipply Front End

## Description
Unipply is a web platform created to minimize the risk of choosing the wrong faculty. It will help the students to visualize all the available faculties within one and more universities, it will give them faculty and specialty recommendations based on their preferences, and will make the application process easy and fast.
For security reasons, the Unipply application and its main features will be available only for authorized people. 
The main technical goal of the application will be the suggestion of the faculties based on student preferences. Unipply recommendations will be based on input data introduced by the student (its preferences, hobbies etc). The recommendations are generated on backend using Machine Learning integration. Initially, this application is oriented for the Technical University of Moldova. The features of the application could be expanded later and be useful for universities all over the country, and then all over the world.
The Unipply platform requires both a client-side and a server-side application. This repository includes the implementation of the user interface or the client-side app.

## Current Working Functionalities
* Authentification
* 3D Platform of the university faculties
* Virtual Tours of the corridors and the classrooms of the faculties
* Application Form
* Specialty Recommendations Form
* My Profile Page

## Used technologies
* Angular 13
* Three.js (3D Js library - https://threejs.org/) 
* Google Street View API (for Virtual Tours)

## How to run

Clone the project. Run `npm i && ng serve` for a dev server. Navigate to http://localhost:4200/.

## Screenshots

The 3D Platform of the university faculties. The map can be rotated, zoomed and panned. The faculties are clickable.
![Alt Text](https://github.com/MargaretaGalaju/University-Application-Management-System-Frontend/blob/main/src/assets/images/readme/university-map1.png)

On faculty click, a right sidebar opens.
![Alt Text](https://github.com/MargaretaGalaju/University-Application-Management-System-Frontend/blob/main/src/assets/images/readme/university-map2.png)

Virtual tours are available for 3 different campuses.
![Alt Text](https://github.com/MargaretaGalaju/University-Application-Management-System-Frontend/blob/main/src/assets/images/readme/virtual-tour1.png)
![Alt Text](https://github.com/MargaretaGalaju/University-Application-Management-System-Frontend/blob/main/src/assets/images/readme/virtual-tour.png)

Based on the introduced hobbies and preferences, user receives personal recommendations.
![Alt Text](https://github.com/MargaretaGalaju/University-Application-Management-System-Frontend/blob/main/src/assets/images/readme/dialog.png)
![Alt Text](https://github.com/MargaretaGalaju/University-Application-Management-System-Frontend/blob/main/src/assets/images/readme/recommendations.png)

User can apply to one or more faculties.
![Alt Text](https://github.com/MargaretaGalaju/University-Application-Management-System-Frontend/blob/main/src/assets/images/readme/application.png)

All the data regarding the current user is saved in the profile page.
![Alt Text](https://github.com/MargaretaGalaju/University-Application-Management-System-Frontend/blob/main/src/assets/images/readme/profile.png)
