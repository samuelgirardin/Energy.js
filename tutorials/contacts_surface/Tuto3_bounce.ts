class Tuto3_bounce {

    private energy: Energy;
    private boxes: Array<BABYLON.InstancedMesh> = new Array<BABYLON.InstancedMesh>();

    /**
    * @this file show us how to use bounce and bounce_vel surface parameter. Must be set in contactFlagMode :
    * @ eg. contactFlagMode = dContactBounce
    * @
    * @bounce: Restitution parameter (0..1). 0 means the surfaces are not bouncy at all, 1 is maximum bouncyness.This is only used if the corresponding flag is set in mode.
    * @bounce_vel : The minimum incoming velocity necessary for bounce.Incoming velocities below this will effectively have a bounce parameter of 0. This is only used
    * @if dContactBounce is set in mode.
    * @eg. energy.setSurfaceParameter(your_mesh, bounce,your_value)
    * @eg. energy.setSurfaceParameter(your_mesh, bounce_vel,your_value) 
    */

    constructor(private scene: BABYLON.Scene) {

        //camera & keyhandler helper & screen info
        this.control();
        
      
          // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)
        // contactFlagMode is set to dContactBounce to compute bounce , bounce_vel is compute when dContactBounce is set
        var contactFlagMode = dContactBounce;

        //init physic engine in quickstemode (faster but less accurate)
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        //this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.03,1);
        this.energy.setMaxContact(6);

        //TODO explain
        this.energy.dWorldSetAutoDisableFlag(1);
        this.energy.dWorldSetAutoDisableAverageSamplesCount(10);

       

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);

        var materials: Materials = new Materials(scene);
        var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, scene);
        box.material = materials.matBlue;
        box.isVisible = false; 

        for (var i = -25; i <25; i = i + 2) {
            for (var j = -25; j < 25; j = j + 2) {

               
                var instance: BABYLON.InstancedMesh;               
                instance = box.createInstance("cube");
                instance.position = new BABYLON.Vector3(i, 15, j);
                this.boxes.push(instance);

                //add the boxes to the simulation - dynamicObjects are created with their own physic default material with the mu parameter(friction) at 0 -
                this.energy.addDynamicObject(instance, Energy.BOX, 1); 
            }
        }

        //we want now assign a different bounce & bounce_vel value to each boxes
        for (var i = 0; i < this.boxes.length; i++) {

            // bounce value 0....1
            this.energy.dBodySetSurfaceParameter(this.boxes[i], bounce, i / (this.boxes.length - 1));
            this.energy.dBodySetSurfaceParameter(this.boxes[i], mu,500);

            // bounce_vel is set at 8; so in this case incomming velocity object must be at abs(8) to bounce.
            // try to increase at 16, you will see that objects will bound fewer time
            // TODO check linearVelocity vector norm = bounceVel
            this.energy.dBodySetSurfaceParameter(this.boxes[i], bounce_vel, 0.01);
        }
        this.energy.startSimulation();
    }



    private key_up(event: any): void {

    

      switch (event.sourceEvent.key) {
            
            case "r":
                var n = 0;
                for (var i = -25; i < 25; i = i + 2) {
                    for (var j = -25; j < 25; j = j + 2) {
                        this.energy.dBodyDisable(this.boxes[n]);
                        this.energy.dBodySetPosition(this.boxes[n], new BABYLON.Vector3(i, 15, j));
                        this.energy.dBodySetQuaternion(this.boxes[n], new BABYLON.Quaternion(0,0,0,1))
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

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(-25, 25, -25));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Bounce : bounce & bounce_vel - (r) reset";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));
    }

}