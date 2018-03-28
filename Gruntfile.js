module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
			options: {
                additionalFlags: '--allowUnreachableCode --declaration'
      },
            default: {
                src: [
				'../babylon.d.ts',
             'energy/material/PhysicMaterial.ts' ,    
     'energy/joints/joint.ts' ,
     'energy/joints/dJointBall.ts' ,
     'energy/joints/dJointHinge.ts' ,
     'energy/joints/dJointHinge2.ts' ,
     'energy/joints/dJointSlider.ts' ,
     'energy/joints/dJointFixed.ts' ,
     'energy/joints/dJointTransmission.ts' ,   
     'energy/primitives/DynamicObject.ts' ,
     'energy/primitives/dynamicBox.ts' ,
     'energy/primitives/dynamicSphere.ts' ,
     'energy/primitives/dynamicCylinder.ts' ,
     'energy/primitives/dynamicCapsule.ts' ,
     'energy/primitives/dynamicConvex.ts' ,
     'energy/primitives/dynamicRay.ts' ,
     'energy/primitives/dynamicHeightmap.ts' ,
     'energy/primitives/dynamicTriMesh.ts' ,
     'energy/primitives/staticPlane.ts' ,
    
	  'energy/energy.ts' ,
     'energy/energyTypeDef.ts' ,
     'energy/energyTools.ts' ,
     'energy/energyMath.ts' ,
     'energy/data.ts'   


                ],
                out: 'energy_w.js'
            }
        },
        uglify: {
            default: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'energy_w.min.js': ['energy_w.js']
                }
            }
        }
    
  });
 


  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks("grunt-ts");
 //  grunt.registerTask("default", ["ts"]);
  grunt.registerTask("default", ["ts", "uglify"]);
  
};


      
