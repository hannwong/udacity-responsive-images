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
      pre_crop: {
        cmd: function() {
          // 'images_precrop' folder contains precrop images.
          // These images are resized proportionately.
          // The only reason we don't pull from 'images_src' instead is because
          //   still_life.jpg is a hybrid case that must be handled thus.

          // The only large versions are the pixel density versions.
          // Udacity's index.html doesn't use '*_large.jpg' versions, though
          //   these files exist in their official solution's 'images' folder.

          var command = 'gm convert ';
          var combined = 'mkdir images images_precrop && ';

          // For images to be resized proportionately, place as-is into
          //   'images_precrop' and leave to task responsive_images:resize.

          // volt.jpg is resized proportionately.
          combined +=
            'cp images_src/volt.jpg images_precrop/volt.jpg && ';

          // postcard.jpg is resized proportionately.
          // Udacity made a mistake with small version.
          // Also, large version (not pixel density version) is not in use.
          combined +=
            'cp images_src/postcard.jpg images_precrop/postcard.jpg && ';

          // For images to be cropped with art direction, crop then leave
          //   directly in 'images'. (Note: still_life.jpg is a hybrid case.)

          // still_life.jpg is cropped to remove white space, but will still be
          //   resized proportionately thereafter for small version.
          combined +=
            command +
            '-gravity South ' +
            '-crop 2000x1000+0+150 ' +
            'images_src/still_life.jpg images_precrop/still_life.jpg ' +
            '&& ';

          // cockatoos.jpg is cropped with art direction.
          combined +=
            command +
            '-crop 2500x1875+490+514 ' +
            '-resize 1000x750 ' +
            'images_src/cockatoos.jpg images/cockatoos-medium.jpg ' +
            '&& ' +
            command +
            '-crop 2400x1800+567+669 ' +
            '-resize 500x375 ' +
            'images_src/cockatoos.jpg images/cockatoos-small.jpg ' +
            '&& ';

          // horses.jpg is cropped with art direction.
          combined +=
            command +
            '-crop 1000x750+317+96 ' +
            'images_src/horses.jpg images/horses-medium.jpg ' +
            '&& ' +
            command +
            '-crop 550x412+505+236 ' +
            '-resize 500x375 ' +
            'images_src/horses.jpg images/horses-small.jpg ';

          return combined;
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
  grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images']);
  grunt.registerTask('optim-img', ['imageoptim']);
  grunt.registerTask('precrop', ['clean', 'exec:pre_crop'])
};
