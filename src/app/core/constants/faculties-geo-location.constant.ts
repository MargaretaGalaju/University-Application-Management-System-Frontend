export const fcim = {
  initialAvailableGeoPosition: {
    lat: 47.061577,
    long: 28.868170,
  },
  additionalPanoramas: [
    {
      imagePath: '/assets/panoramas/fcim/1.jpg',
      pano: 'first', // The ID for this custom this.panorama.
      description: 'First',
      position: {
        lat:  47.061621,
        long: 28.867827,
      },
      links: [
        {
          heading: 0,
          description: 'FCIM first',
          pano: 'fcim',
        }
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/2.jpg',
      pano: 'fcim', // The ID for this custom this.panorama.
      description: 'Entrance of Faculty of Technical University of Moldova',
      position: {
        lat: 47.061606,
        long: 28.867924,
      },
      links: [
        {
          heading: 0,
          description: 'FCIM first corridor',
          pano: 'fcim_corridor1',
        },
        {
          heading: 180,
          description: 'back to entrance',
          pano: 'first',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/3.jpg',
      pano: 'fcim_corridor1', // The ID for this custom this.panorama.
      description: 'Corridor 1 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.061918,
        long: 28.868000,
      },
      links: [
        {
          heading: 0,
          description: 'FCIM second corridor',
          pano: 'fcim_corridor2',
        },
        {
          heading: 180,
          description: 'back to entrance',
          pano: 'fcim',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/4.jpg',
      pano: 'fcim_corridor2', // The ID for this custom this.panorama.
      description: 'Corridor 2 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      links: [
        {
          heading: 0,
          description: 'FCIM third corridor',
          pano: 'fcim_corridor3',
        },
        {
          heading: 180,
          description: 'back to first corridor',
          pano: 'fcim_corridor1',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/5.jpg',
      pano: 'fcim_corridor3', // The ID for this custom this.panorama.
      description: 'Corridor 2 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      centerHeading: 180,
      links: [
        {
          heading: 0,
          description: 'FCIM third corridor',
          pano: 'fcim_corridor4',
        },
        {
          heading: 180,
          description: 'back to first corridor',
          pano: 'fcim_corridor2',
        },
        {
          heading: 270,
          description: 'go to floor 2',
          pano: 'ffcim_corridor3-1',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/5_1.jpg',
      pano: 'fcim_corridor3-1', // The ID for this custom this.panorama.
      description: 'Etajul 2',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      centerHeading: 180,
      links: [
        {
          heading: 0,
          description: 'FCIM third corridor',
          pano: 'fcim_corridor3',
        },
        // {
        //   heading: 180,
        //   description: 'back to first corridor',
        //   pano: 'fcim_corridor2',
        // },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/6.jpg',
      pano: 'fcim_corridor4', // The ID for this custom this.panorama.
      description: 'Corridor 2 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      centerHeading: 180,
      links: [
        {
          heading: 0,
          description: 'FCIM third corridor',
          pano: 'fcim_corridor5',
        },
        {
          heading: 180,
          description: 'back to first corridor',
          pano: 'fcim_corridor3',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/7.jpg',
      pano: 'fcim_corridor5', // The ID for this custom this.panorama.
      description: 'Corridor 2 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      centerHeading: 180,
      links: [
        {
          heading: 0,
          description: 'FCIM third corridor',
          pano: 'fcim_corridor6',
        },
        {
          heading: 180,
          description: 'back to first corridor',
          pano: 'fcim_corridor4',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/8.jpg',
      pano: 'fcim_corridor6', // The ID for this custom this.panorama.
      description: 'Corridor 2 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      centerHeading: 180,
      links: [
        {
          heading: 0,
          description: 'FCIM third corridor',
          pano: 'fcim_corridor7',
        },
        {
          heading: 180,
          description: 'back to first corridor',
          pano: 'fcim_corridor5',
        },
      ],
    },
    
    {
      imagePath: '/assets/panoramas/fcim/9.jpg',
      pano: 'fcim_corridor7', // The ID for this custom this.panorama.
      description: 'Corridor 2 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      centerHeading: 180,
      links: [
        {
          heading: 270,
          description: 'Cabbinet',
          pano: 'fcim_cabinet',
        },
        {
          heading: 180,
          description: 'back to first corridor',
          pano: 'fcim_corridor6',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/10.jpg',
      pano: 'fcim_cabinet', // The ID for this custom this.panorama.
      description: 'Cabinet',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      centerHeading: 270,
      links: [
        {
          heading: 180,
          description: 'back to first corridor',
          pano: 'fcim_corridor7',
        },
      ],
    },
    // {
    //   imagePath: '/assets/panoramas/fcim/entrance.JPG',
    //   pano: 'fcim_corridor3', // The ID for this custom this.panorama.
    //   description: 'Corridor 3 of Faculty of Technical University of Moldova',
    //   position: {
    //     lat: 47.062578,
    //     long: 28.868310,
    //   }
    // },
    // {
    //   imagePath: '/assets/panoramas/fcim/entrance.JPG',
    //   pano: 'fcim_class1', // The ID for this custom this.panorama.
    //   description: 'Classrom 1 of Faculty of Technical University of Moldova',
    //   position: {
    //     lat: 47.062588,
    //     long: 28.868270,
    //   }
    // },
    // {
    //   imagePath: '/assets/panoramas/fcim/entrance.JPG',
    //   pano: 'fcim_class2', // The ID for this custom this.panorama.
    //   description: 'Classrom 2 of Faculty of Technical University of Moldova',
    //   position: {
    //     lat: 47.062588,
    //     long: 28.868390,
    //   }
    // },
  ]
}