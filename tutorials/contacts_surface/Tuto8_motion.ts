class Tuto8_motion {

    private energy: Energy;
    private boxes: Array<BABYLON.InstancedMesh> = new Array<BABYLON.InstancedMesh>();
    private boxes1: Array<BABYLON.InstancedMesh> = new Array<BABYLON.InstancedMesh>();


    private lift: BABYLON.Mesh;
    private angle: number = 0;

    private last_motionVector: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
    private motionVector: BABYLON.Vector3; 

    private goUp: boolean = true; 
    private goDown: boolean = true;

    private b: BABYLON.Mesh;
    private a: BABYLON.Mesh;


   

    constructor(private scene: BABYLON.Scene) {

        //camera & keyhandler helper & screen info
        this.control(); 

        // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)

        // contactFlagMode is set to dContactMu2 to compute mu2 , mu parameter is compute by default
        var contactFlagMode = dContactBounce   // | dContactSoftCFM | dContactSoftERP;
        var contactFlagMode2 = dContactMotionN | dContactMotion1 | dContactMotion2 | dContactFDir1;



        //init physic engine in quickstemode (faster but less accurate)
        //TODO in this particular case check the association motionVector and numStep, it zppears that the correction is to high *2 /2 ? 
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
       // this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.030,1);
        this.energy.setMaxContact(3);

      //  this.energy.dWorldSetAutoDisableFlag(1);
        this.energy.dWorldSetAutoDisableAverageSamplesCount(30);
        this.energy.dWorldSetAutoDisableLinearThreshold(0.25);
        this.energy.dWorldSetAutoDisableAngularThreshold(0.25);

       // new GUI(scene, this.energy);

        Energy.setFlagmode2(contactFlagMode2);
        //this.energy.dWorldSetCFM(0.00001);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);
        var materials: Materials = new Materials(scene);
       


       // this.energy.dBodySetSurfaceParameter(box, motionN, 0.0);

        //create the lift aka platform
       
        this.lift = BABYLON.Mesh.CreateBox("lift", 0);
        this.lift.position = new BABYLON.Vector3(0, 1, 0);
        this.lift.scaling = new BABYLON.Vector3(30, 0.5, 30);
        this.lift.material = materials.matBlue;
        this.energy.addDynamicObject(this.lift, Energy.BOX, 0);

        //add surfaceparameter for lift
        this.energy.dBodySetSurfaceParameter(this.lift, mu, 1000);
        this.energy.dBodySetSurfaceParameter(this.lift, motionN, 0.1);
        this.energy.dBodySetSurfaceParameter(this.lift, bounce, 0.2);
        this.energy.setMotionVector(this.lift, BABYLON.Vector3.Zero());


        this.b = BABYLON.Mesh.CreateBox("", 2);
        var materials: Materials = new Materials(this.scene);
        this.b.material = materials.matRed;
        this.b.isVisible = false;

        this.a = BABYLON.Mesh.CreateBox("", 2);
        var materials: Materials = new Materials(this.scene);
        this.a.material = materials.matBlue;
        this.a.isVisible = false;

       
       // this.scene.registerBeforeRender(()=>this.move())

        this.energy.startSimulation();
        this.scene.registerBeforeRender(() => this.move())

    }



    private move(): void {
        var speed = 0.015

        if (this.goUp) {
            this.angle += speed ;
           
           
            if (this.angle > 6.24) {
                this.goUp = false;
                this.goDown = true;
                speed += 0.002;
            }
        }

        if (this.goDown) {
            this.angle -= speed;
            
            if (this.angle <=0 ) {
                this.goUp = true;
                this.goDown = false;
                speed += 0.002;
            }
        }
        var position: BABYLON.Vector3 = new BABYLON.Vector3(6 + 4 * Math.cos(this.angle), 6 + 4 * Math.sin(this.angle), 0);
        this.energy.dGeomSetPosition(this.lift, position);


        //  5 * 0.03 = 0.15;
        //     *0.03      = 1

        this.motionVector = position.subtract(this.last_motionVector);
        this.energy.setMotionVector(this.lift, this.motionVector);
        this.last_motionVector = position;
    }



    private key_up(event: any): void {

        switch (event.sourceEvent.key) {

            case "a":
                for (var i = 0; i < this.boxes.length; i++) {
                    this.energy.dBodyEnable(this.boxes[i]);
                    this.energy.dBodyAddForce(this.boxes[i], new BABYLON.Vector3(0,500,0),false)
                }
                break; 
            case "s":
                console.log("press s____________"); 
                var n = 0;
               // var box = BABYLON.Mesh.CreateBox("", 1);
                var materials: Materials = new Materials(this.scene);
              //  box.material = materials.matGreen;

                var box: BABYLON.InstancedMesh;
                box = this.b.createInstance("cube");
                var box1: BABYLON.InstancedMesh;
                box1 = this.a.createInstance("cube");
                box1.isVisible = false;

               // box.position = new BABYLON.Vector3(i, 15, j);
              //  this.boxes.push(instance);
               var v = this.energy.dGeomGetPosition(this.lift);
               box.position = new BABYLON.Vector3(v[0] + Math.random() * 5, v[1] + 10, v[2] + Math.random() * 5);
             
               // box.position = new BABYLON.Vector3(0, 20, 0);;
                
                this.energy.addDynamicObject(box, Energy.BOX, 1);
              //  this.energy.dBodySetSurfaceParameter(box, motionN, 0.0);
                this.energy.dBodySetSurfaceParameter(box, mu, 50);
                this.energy.dBodySetSurfaceParameter(box, bounce, 0);
                this.energy.dBodySetSurfaceParameter(box, bounce, 0.0);
              //  this.energy.dBodySetSurfaceParameter(box, rho, 0.75); 

                this.boxes.push(box);
              
               
                break;
            case "r":
              
              //   this.scene.registerBeforeRender(()=>this.move())
                break;
        }
    }

    private t: number; 

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(-25, 25, -25));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Motion  - (s) drop box ";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => this.key_up(evt)));
    }

}