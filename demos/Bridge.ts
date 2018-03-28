class Bridge {

    private scene: BABYLON.Scene;
    private energy: Energy;

    private meshes: BABYLON.AbstractMesh[] = [];

    private assetsManager: BABYLON.AssetsManager;

    private bodies: BABYLON.AbstractMesh[] = [];


    constructor(scene: BABYLON.Scene) {




        this.scene = scene;

        var materials: Materials = new Materials(this.scene);

        this.control();

        var contactFlagMode = dContactBounce;

        //init physic engine in quickstemode (faster but less accurate)
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
       //   this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode,1,20);
        this.energy.setTimeStepAndNumStep(0.03, 1);
        this.energy.setMaxContact(6);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);

        
      /*  var NUM = 48;
        var SEGMDIM = [0.9, 0.1, 20];

        var segbody: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1);
        segbody.isVisible = false;
        segbody.material = materials.matRed;
        segbody.scaling = new BABYLON.Vector3(SEGMDIM[0], SEGMDIM[1], SEGMDIM[2]);
        for (var i = 0; i < NUM; i++) {
            var ins = segbody.createInstance("");
            this.bodies.push(ins);
            this.energy.addDynamicObject(ins, Energy.BOX, 1);
            this.energy.dBodySetPosition(ins, new BABYLON.Vector3(i - NUM / 2.0 - 10, 30, 0)); 

            console.log(this.energy.dGeomGetPosition  (ins)); 

            this.energy.dBodySetSurfaceParameter(ins, mu, 100); 
        }

        */


      /*  var i = 0; 
        var anchor = new BABYLON.Vector3(i + 0.5 - NUM / 2.0 - 10, 30, 0);
        var axis = new BABYLON.Vector3(0, 0, 1);
        var joint = this.energy.addDJointHinge(this.bodies[i],0, anchor, axis, "h");
        this.energy.dJointSetParam(joint, dParamFMax, 100000000.0);
        this.energy.dJointSetParam(joint, dParamCFM, 0.0001);
        this.energy.dJointSetParam(joint, dParamERP, .95);  */
   
      //  var i = NUM-1;
     //   var anchor = new BABYLON.Vector3(i + 0.5 - NUM / 2.0 - 10, 30, 0);
     //   var axis = new BABYLON.Vector3(0, 0, 1);
     //   var joint = this.energy.addDJointHinge(this.bodies[i], 0, anchor, axis, "h");
      //  this.energy.dJointSetParam(joint, dParamFMax, 100000000.0);
     //   this.energy.dJointSetParam(joint, dParamCFM, 0.0001);
     ////   this.energy.dJointSetParam(joint, dParamERP, .95); 


     /*   for ( i = 0; i < NUM - 1; i++) {
            var anchor = new BABYLON.Vector3(i + 0.5 - NUM / 2.0 - 10, 30, 0);
            var axis = new BABYLON.Vector3(0, 0, 1); 
            var joint = this.energy.addDJointHinge(this.bodies[i], this.bodies[i + 1], anchor, axis, "h");
            this.energy.dJointSetParam(joint, dParamFMax, 1000.0); 
         //   this.energy.dJointSetParam(joint, dParamCFM, 0.000001);
         //   this.energy.dJointSetParam(joint, dParamERP, .99);

        }*/


      /*  var slider;
        slider = this.energy.addDJointSlider(this.bodies[NUM-1], 0, new BABYLON.Vector3(1, 0, 0), "s"); 
        this.energy.dJointSetParam(slider, dParamFMax, 1.0);
        this.energy.dJointSetParam(slider, dParamLoStop, 0);
        this.energy.dJointSetParam(slider, dParamHiStop, 0);*/

      /*   var slider;
        slider = this.energy.addDJointSlider(this.bodies[0], 0, new BABYLON.Vector3(0, 1, 0), "s"); 
        this.energy.dJointSetParam(slider, dParamFMax, 10000.0); 
        this.energy.dJointSetParam(slider, dParamLoStop, -20);
        this.energy.dJointSetParam(slider, dParamHiStop, 20); */

      
        




        var bbox = BABYLON.Mesh.CreateBox("", 1);
        bbox.isVisible = false;
        bbox.scaling = new BABYLON.Vector3(1, 1, 1);
        bbox.material = materials.wood;

        for (var i = 0; i < 1000; i++) {

            var ibox = bbox.createInstance("");
            this.energy.addDynamicObject(ibox, Energy.BOX ,1); 
            this.energy.dBodySetPosition(ibox, new BABYLON.Vector3(0, 5+i, 0));
            this.energy.dBodySetSurfaceParameter(ibox, mu, 250); 
         

        }
      


        this.energy.startSimulation();

    }

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(50, 25, 50));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Trimeshes & Heighmap - q,s(up +y),d move ";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => this.key_up(evt)));
    }

    private key_up(event: any): void {


        this.energy.dBodyAddForce(this.bodies[32], new BABYLON.Vector3(0, 2500, 0)); 
    }
}