/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    exec: {
      /**
        * Art direction handling of images. This only outputs medium and small
        *  versions of images.
        * The only large versions are the pixel density versions.
        * Udacity's index.html doesn't use '*_large.jpg' versions, though
        *  these files exist in their official solution's 'images' folder.
        *
        * Some images are resized proportionately, whereas others are cropped
        *  with art direction. Some are a combination of both.
        * As such, it is too complicated to handle using grunt task
        *  responsive_images. Moreover, `gm' is easy enough to use.
        */
      art_direct: {
        cmd: function() {
          var command = 'gm convert ';
          var resize_medium = '-resize 1000x750 ';
          var resize_small = '-resize 500x375 ';

          var commands = [];

          // still_life.jpg is cropped to remove white space, but will still be
          //   resized proportionately thereafter for small version.
          var crop_first = '-gravity South -crop 2000x1000+0+150 ';
          commands.push(command +
            crop_first +
            '-resize 1000x500 ' +
            'images_src/still_life.jpg images/still_life_medium.jpg');
          commands.push(command +
            crop_first +
            '-resize 500x250 ' +
            'images_src/still_life.jpg images/still_life_small.jpg');

          // horses.jpg is cropped with art direction.
          commands.push(command +
            '-crop 1000x750+317+96 ' +
            'images_src/horses.jpg images/horses-medium.jpg');
          commands.push(command +
            '-crop 550x412+505+236 ' +
            '-resize 500x375 ' +
            'images_src/horses.jpg images/horses-small.jpg');

          // volt.jpg is resized proportionately.
          commands.push(command +
            resize_medium + ' images_src/volt.jpg images/volt_medium.jpg');
          commands.push(command +
            resize_small + ' images_src/volt.jpg images/volt_small.jpg');

          // cockatoos.jpg is cropped with art direction.
          commands.push(command +
            '-crop 2500x1875+490+514 ' +
            resize_medium +
            'images_src/cockatoos.jpg images/cockatoos-medium.jpg');
          commands.push(command +
            '-crop 2370x1800+567+669 ' +
            resize_small +
            'images_src/cockatoos.jpg images/cockatoos-small.jpg');

          // postcard.jpg is resized proportionately.
          // Udacity made a mistake with small version.
          commands.push(command +
            resize_medium +
            ' images_src/postcard.jpg images/postcard_medium.jpg');
          commands.push(command +
            resize_small +
            'images_src/postcard.jpg images/postcard_small.jpg');

          // grasshopper.jpg is cropped with art direction.
          // The original's color is lighter. Maybe Udacity misplaced the
          //  real original.
          commands.push(command +
            '-crop 1944x1458+0+425 ' +
            resize_medium +
            'images_src/grasshopper.jpg images/grasshopper_medium.jpg');
          commands.push(command +
            '-crop 1332x999+0+450 ' +
            resize_small +
            'images_src/grasshopper.jpg images/grasshopper_small.jpg');

          // sfo.jpg is cropped with art direction.
          commands.push(command +
            '-crop 2572x1929+0+0 ' +
            resize_medium +
            'images_src/sfo.jpg images/sfo_medium.jpg');
          commands.push(command +
            '-crop 1588x1191+0+0 ' +
            resize_small +
            'images_src/sfo.jpg images/sfo_small.jpg');

          // rosella.jpg is cropped with art direction.
          commands.push(command +
            '-crop 1804x1353+115+526 ' +
            resize_medium +
            'images_src/rosella.jpg images/rosella_medium.jpg');
          commands.push(command +
            '-crop 1268x951+545+592 ' +
            resize_small +
            'images_src/rosella.jpg images/rosella_small.jpg');

          return commands.join(' && ');
        }
      }
    },
    responsive_images: {
      pixel_density: {
        options: {
          engine: 'gm',
          sizes: [{
            width: 1600, /* 50em for font-size 16px is 800px. 2x display.*/
            suffix: "_large_2x",
            quality: 30
          }, {
            width: 800,
            suffix: "_large_1x",
            quality: 30
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/',
          dest: 'images/'
        }]
      }
    },

    imageoptim: {
      dev: {
        options: {
          jpegMini: false,
          imageAlpha: false,
          quitAfter: true
        },
        src: ['images']
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images_precrop', 'images'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['images_precrop', 'images']
        },
      },
    },

    /* Copy the "fixed" images that don't go through processing into the images/directory */
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: 'images_src', /* Corrects Udacity code, avoids nested folder. */
          src: 'fixed/*.{gif,jpg,png}',
          dest: 'images/'
        }]
      },
    },
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-imageoptim');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('art-direct', ['exec:art_direct']);
  grunt.registerTask('default',
    ['clean', 'mkdir', 'copy', 'responsive_images', 'art-direct']);
  grunt.registerTask('optim-img', ['imageoptim']);
};
