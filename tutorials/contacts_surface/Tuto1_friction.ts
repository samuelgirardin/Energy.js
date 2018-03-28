class Tuto1_friction {


    private energy: Energy;
    private boxes: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();
    private points: Array<BABYLON.InstancedMesh> = new Array<BABYLON.InstancedMesh>(); 


    /**
    * @this file show us how to use friction. When you create a dynamic object , energy.js create a physic material.
    * @it deals with the dynamic object's surface parameter. mu is the friction parameter.
    * @eg. energy.setSurfaceParameter(your_mesh, mu,your_value)
    * @
    * @mu: Coulomb friction coefficient.This must be in the range 0 to dInfinity. 0 results in a frictionless contact,
    * @and dInfinity results in a contact that never slips.Note that frictionless contacts are less time consuming to 
    * @compute than ones with friction, and infinite friction contacts can be cheaper than contacts with finite friction.
    * @This must always be set.
    */

    constructor(private scene: BABYLON.Scene) {

        //keyhandler helper & screen info
        this.control();

        // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)

        // in this particular test, contactFlagMode is set to null, mu parameter is the only surface parameter compute by default by energy.js
        var contactFlagMode =  dContactSoftCFM | dContactSoftERP; 

        //init physic engine in quickstemode (faster but less accurate)
     //   this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
       //  this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0),  Energy.NORMAL_STEP,contactFlagMode);
      //  this.energy.setTimeStepAndNumStep(0.03, 1);
     //   this.energy.setMaxContact(6);
     //   this.energy.dWorldSetCFM(1e-8); 

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
      //  this.energy.addStaticPlane(0, 0, 1, 0);

        var materials: Materials = new Materials(this.scene);


      //  var materials: Materials = new Materials(this.scene);
       // var side = 0.1;
      //  var cube: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", side, this.scene);
      //  cube.material = materials.matRed;
      //  cube.isVisible = false;
        //create instance
      //  for (var i = 0; i < 1000; i++) {
          //  var instance: BABYLON.InstancedMesh;
            //var position = new BABYLON.Vector3(Energy.Col[i], Energy.Col[i + 2], Energy.Col[i + 1]);
          //  instance = cube.createInstance("cube");
           // instance.position = position;
          //  instance.isPickable = false;
          //  this.points[i] = instance; 
     //   }
        
      var   side = 1;
      


        var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", side, scene);
        box.material = materials.matBlue;
        box.position = new BABYLON.Vector3(0, 5, 0);
        box.scaling = new BABYLON.Vector3(4, 2, 4)
     //   this.energy.addDynamicObject(box, Energy.BOX, 1);
      //  this.energy.dBodySetSurfaceParameter(box, mu, 500);
     //   this.energy.dBodySetSurfaceParameter(box, bounce, .9);
     //   this.energy.dBodySetSurfaceParameter(box, bounce_vel, .9);
     //   this.energy.dBodySetSurfaceParameter(box, soft_cfm, 0.01);
      //  this.energy.dBodySetSurfaceParameter(box, soft_erp, 0.5);



     //   this.energy.addDynamicRay(11);

     //   this.energy.startSimulation();

     //   this.scene.registerBeforeRender(() => this.collision()); 

    }


    private collision(): void {       
        var t = 0; 
        for (var i = 0; i < Energy.Col.length; i = i + 3) {           
            var position = new BABYLON.Vector3(Energy.Col[i], Energy.Col[i + 2], Energy.Col[i + 1]);
            if (this.points[t])
            this.points[t].position = position; 
            t++;            
        }
    }

    private ff = 0; 

    private key_up(event: any): void {

      //  this.energy.deleteSimulation(false);

      //  console.log(this.energy.dxContactgroup, this.energy.dxSpace, this.energy.dxWorld)

        this.energy.destroySimulation(); 
       

      /*  var materials: Materials = new Materials(this.scene);

       

        //cube
        var side = 1;
        var cube: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", side, this.scene);
        cube.material = materials.matRed;
        cube.position = new BABYLON.Vector3(0, 80, 0); 
        this.energy.addDynamicObject(cube, Energy.BOX, 1);
        this.energy.dBodySetSurfaceParameter(cube, mu, 500);
        this.energy.dBodySetSurfaceParameter(cube, soft_cfm, 0.01);
        this.energy.dBodySetSurfaceParameter(cube, soft_erp, 0.5);*/
      

       

      

    }

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(25, 25, 25));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;
        document.getElementById("control").innerHTML = "energy.js - Friction : mu - (s) start - (r) reset";
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));
    }








}