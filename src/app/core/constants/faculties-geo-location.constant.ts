export const fcim = {
  initialAvailableGeoPosition: {
    lat: 47.061577,
    long: 28.868170,
  },
  additionalPanoramas: [
    {
      imagePath: '/assets/panoramas/fcim/first.jpg',
      pano: 'first', // The ID for this custom this.panorama.
      description: 'First',
      position: {
        lat:  47.061621,
        long: 28.867827,
      },
      links: [
        {
          heading: 25,
          description: 'FCIM first',
          pano: 'fcim',
        }
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/entrance.JPG',
      pano: 'fcim', // The ID for this custom this.panorama.
      description: 'Entrance of Faculty of Technical University of Moldova',
      position: {
        lat: 47.061606,
        long: 28.867924,
      },
      links: [
        {
          heading: 25,
          description: 'FCIM first corridor',
          pano: 'fcim_corridor1',
        },
        {
          heading: 195,
          description: 'back to entrance',
          pano: 'first',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/entrance.JPG',
      pano: 'fcim_corridor1', // The ID for this custom this.panorama.
      description: 'Corridor 1 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.061918,
        long: 28.868000,
      },
      links: [
        {
          heading: 25,
          description: 'FCIM second corridor',
          pano: 'fcim_corridor2',
        },
        {
          heading: 195,
          description: 'back to entrance',
          pano: 'fcim',
        },
      ],
    },
    {
      imagePath: '/assets/panoramas/fcim/entrance.JPG',
      pano: 'fcim_corridor2', // The ID for this custom this.panorama.
      description: 'Corridor 2 of Faculty of Technical University of Moldova',
      position: {
        lat: 47.062118,
        long: 28.868110,
      },
      links: [
        {
          heading: 25,
          description: 'FCIM third corridor',
          pano: 'fcim_corridor3',
        },
        {
          heading: 195,
          description: 'back to first corridor',
          pano: 'fcim_corridor1',
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