class Tuto2_friction2 {

  
    private energy: Energy;
    private boxes: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();
   

    /**
    * @this file show us the use of the second friction parameter mu2. The contactFlagMode must be set to be compute.
    * @with contactFlagMode =  dContactMu2. So when mu2 is set , you have the mu friction on -z -> z direction  and with mu2
    * you set a friction on -x -> x direction
    * @eg. energy.setSurfaceParameter(your_mesh, mu2,your_value)
    * @
    * @mu: Coulomb friction coefficient.This must be in the range 0 to dInfinity. 0 results in a frictionless contact,
    * @and dInfinity results in a contact that never slips.Note that frictionless contacts are less time consuming to 
    * @compute than ones with friction, and infinite friction contacts can be cheaper than contacts with finite friction.
    * @This must always be set.
    */

    constructor(private scene: BABYLON.Scene) {

        //camera & keyhandler helper & screen info
        this.control(); 

        // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)

        // contactFlagMode is set to dContactMu2 to compute mu2 , mu parameter is compute by default
        var contactFlagMode =  dContactMu2;

        //init physic engine in quickstemode (faster but less accurate)
       // this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0),  Energy.NORMAL_STEP,contactFlagMode,1,20);
        this.energy.setTimeStepAndNumStep(0.030, 1);
        this.energy.setMaxContact(6);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);

        var side = 1
        var materials: Materials = new Materials(scene);

        for (var i = -7; i < 5; i = i + 2) {
            for (var j = -7; j < 5; j = j + 2) {
                //meshes creation - 25 boxes
                var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", side, scene);
                box.material = materials.matBlue;
                box.position = new BABYLON.Vector3(i, 0.5, j);               
                this.boxes.push(box); 

                //add the boxes to the simulation - dynamicObjects are created with their own physic default material with the mu parameter(friction) at 0 -
                this.energy.addDynamicObject(box, Energy.BOX, 1);
             }
        }


        //we want now assign a different mu value to each boxes
        for (var i = 0; i < this.boxes.length; i++){               
                // we set both mu and mu2
                this.energy.dBodySetSurfaceParameter(this.boxes[i], mu, 0.5);
                this.energy.dBodySetSurfaceParameter(this.boxes[i], mu2, 3); 
        } 
       
        this.energy.startSimulation();

      
    }

   

    

    private key_up(event:any): void {

        var key = event.sourceEvent.key;

       // console.log(event); 

        switch (key) {
            case "s":
                var n = 0;
                for (var i = 0; i < 12; i = i + 2) {
                    for (var j = 0; j < 12; j = j + 2) {
                        if (j < 6) {
                            this.energy.dBodyAddForce(this.boxes[n], new BABYLON.Vector3(-250, 0, 0), false);
                        } else {
                            this.energy.dBodyAddForce(this.boxes[n], new BABYLON.Vector3(0, 0, 250), false);
                        }
                        n++; 
                    }
                }
                break;
            case "r":
                var n = 0;
                for (var i = -7; i < 5; i = i + 2) {
                    for (var j = -7; j < 5; j = j + 2) {
                        this.energy.dBodyDisable(this.boxes[n]);
                        this.energy.dBodySetPosition(this.boxes[n], new BABYLON.Vector3(i, 0.5, j));
                        this.energy.dBodySetForce(this.boxes[n], new BABYLON.Vector3(0, 0, 0));
                        this.energy.dBodySetTorque(this.boxes[n], new BABYLON.Vector3(0, 0, 0));
                        this.energy.dBodySetLinearVel(this.boxes[n], new BABYLON.Vector3(0, 0, 0));
                        this.energy.dBodySetAngularVel(this.boxes[n], new BABYLON.Vector3(0, 0, 0));
                        this.energy.dBodyEnable(this.boxes[n]);
                        n++;
                    }
                }
                break;           
        }
    }

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0),this. scene);
        camera.setPosition(new BABYLON.Vector3(-25, 25, -25));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Friction : mu & mu2 - (s) start - (r) reset";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));

        // -x x helper
        var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this.scene);
        box.position = new BABYLON.Vector3(-30, 0.5, 0);
        var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this.scene);
        box.position = new BABYLON.Vector3(30, 0.5, 0);
    }



  


    

}