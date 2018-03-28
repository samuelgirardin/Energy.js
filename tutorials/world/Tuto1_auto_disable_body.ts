class Tuto1_auto_disable_body {

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

    private bo : boolean = true;




    constructor(private scene: BABYLON.Scene) {

        //camera & keyhandler helper & screen info
        this.control();

        // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)

        var contactFlagMode = dContactBounce;

        //init physic engine in quickstemode (faster but less accurate)
        //TODO in this particular case check the association motionVector and numStep, it zppears that the correction is to high *2 /2 ? 
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        // this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode);

       

        this.energy.setTimeStepAndNumStep(0.033, 1);
        this.energy.setMaxContact(6);

        //parameter for energy to disable idle body // see doc 

        //dWorldSetAutoDisableFlag must be set to initiate the process
        this.energy.dWorldSetAutoDisableFlag(1);

        //see other parameter in the different testcase in


        this.energy.dWorldSetAutoDisableAverageSamplesCount(10);
        // this.energy.dWorldSetAutoDisableSteps(50);
       // this.energy.dWorldSetAutoDisableTime(50);
        this.energy.dWorldSetAutoDisableLinearThreshold(0.15);
        this.energy.dWorldSetAutoDisableAngularThreshold(0.15);

        //do we want notification from energy.cpp.js for disabled body ? it can be global or body by body see Energy.dBodySetFlags
        this.energy.dWorldSetFlags(dxBodyStateNotifyEnergy);
        this.energy.dWorldSetNotificationInterval(10);

      

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);
        var materials: Materials = new Materials(scene);

        //for instance creation
      //  this.b = BABYLON.Mesh.CreateBox("", 2);
         this.b = BABYLON.Mesh.CreateBox("", 2);
        var materials: Materials = new Materials(this.scene);
        this.b.material = materials.matRed;
        this.b.isVisible = false;
        //for instance creation
        this.a = BABYLON.Mesh.CreateBox("", 2);
        var materials: Materials = new Materials(this.scene);
        this.a.material = materials.matGray;
        this.a.isVisible = false;
        // this.scene.registerBeforeRender(()=>this.move())

        this.energy.startSimulation();
    }

    private t1; 
    private t2;

    private key_up(event: any): void {

        switch (event.sourceEvent.key) {

            case "a":
               /* for (var i = 0; i < this.boxes.length; i++) {
                  //  this.energy.dBodyEnable(this.boxes[i]);
                    this.energy.dBodyAddForce(this.boxes[i], new BABYLON.Vector3(0,  0, 1000), false)
                }*/
                break;
            case "z":
                for (var i = 0; i < this.boxes.length; i++) {
                    this.energy.dBodyEnable(this.boxes[i]);
                    
                }
                var a = parseInt((Math.random() * 120).toString());
                this.energy.dBodyEnable(this.boxes[a]);
              //  this.energy.dBodySetSurfaceParameter(this.boxes[a], mu, 0);
                this.energy.dBodyAddForce(this.boxes[a], new BABYLON.Vector3(200000, 0, 0), true)
               
                break;
            case "s":

                if (!this.bo) return;

              this.  t1 = Date.now(); 

                this.bo = false; 

                var materials: Materials = new Materials(this.scene);
                var n = 12;
                var r = 7.5;
                for (var j = 0; j < 40; j++){
                    
                    for (var i = 0; i < n-1; i++) {
                        var box: BABYLON.InstancedMesh = this.b.createInstance("cube"+i);                       
                       /// box.isPickable = false;
                        var a = (i / (n - 1) * Math.PI * 2) + (j * Math.PI/(n-1));
                        var v = new BABYLON.Vector3(r * Math.cos(a), 1+j*2, r * Math.sin(a)-0.5);
                        box.position = v;
                        box.rotation.y = -a;
                        box.scaling = new BABYLON.Vector3(1, 1, Math.PI * r / (n));
                        box.actionManager = new BABYLON.ActionManager(this.scene);
                       

                        this.boxes.push(box);
                        this.energy.addDynamicObject(box, Energy.BOX, 1);
                      
                        this.energy.dBodySetSurfaceParameter(box, mu, 150);
                       

                       
                            this.energy.dBodySetNotification_interval(box, 0);
                            this.energy.dBodySetFlags(box, dxBodyStateNotifyEnergy);
                       

                        var box1: BABYLON.InstancedMesh = this.a.createInstance("cube");
                        box1.isVisible = false;
                        box1.parent = box;
                    }
                }

                for (var j = 0; j < 40; j++) {

                    for (var i = 0; i < n - 1; i++) {
                        var box: BABYLON.InstancedMesh = this.b.createInstance("cube" + i);
                        /// box.isPickable = false;
                        var a = (i / (n - 1) * Math.PI * 2) + (j * Math.PI / (n - 1));
                        var v = new BABYLON.Vector3(r * Math.cos(a), 1 + j * 2, r * Math.sin(a) - 0.5-25);
                        box.position = v;
                        box.rotation.y = -a;
                        box.scaling = new BABYLON.Vector3(1, 1, Math.PI * r / (n));
                        box.actionManager = new BABYLON.ActionManager(this.scene);


                        this.boxes.push(box);
                        this.energy.addDynamicObject(box, Energy.BOX, 1);

                        this.energy.dBodySetSurfaceParameter(box, mu, 150);



                        this.energy.dBodySetNotification_interval(box, 0);
                        this.energy.dBodySetFlags(box, dxBodyStateNotifyEnergy);


                        var box1: BABYLON.InstancedMesh = this.a.createInstance("cube");
                        box1.isVisible = false;
                        box1.parent = box;
                    }
                }

                for (var j = 0; j < 40; j++) {

                    for (var i = 0; i < n - 1; i++) {
                        var box: BABYLON.InstancedMesh = this.b.createInstance("cube" + i);
                        /// box.isPickable = false;
                        var a = (i / (n - 1) * Math.PI * 2) + (j * Math.PI / (n - 1));
                        var v = new BABYLON.Vector3(r * Math.cos(a) , 1 + j * 2, r * Math.sin(a) - 0.5 + 25);
                        box.position = v;
                        box.rotation.y = -a;
                        box.scaling = new BABYLON.Vector3(1, 1, Math.PI * r / (n));
                        box.actionManager = new BABYLON.ActionManager(this.scene);


                        this.boxes.push(box);
                        this.energy.addDynamicObject(box, Energy.BOX, 1);

                        this.energy.dBodySetSurfaceParameter(box, mu, 150);



                        this.energy.dBodySetNotification_interval(box, 0);
                        this.energy.dBodySetFlags(box, dxBodyStateNotifyEnergy);


                        var box1: BABYLON.InstancedMesh = this.a.createInstance("cube");
                        box1.isVisible = false;
                        box1.parent = box;
                    }
                }

                this.scene.registerAfterRender(() => this.test());

               
              
               // this.boxes1.push(box1);

              /*   for (var i = 0; i < this.boxes.length; i++) {
                      if (this.energy.dBodyIsEnabled(this.boxes[i]) != 0) {
                          //  this.boxes[i].scaling = new BABYLON.Vector3(.5, .5, .5);
                          this.boxes[i].isVisible = false;
                          this.boxes1[i].isVisible = true;
                          this.boxes1[i].position = this.boxes[i].position;
                          
                      } else {
                          this.boxes[i].isVisible = true;
                          this.boxes1[i].isVisible = false;
                          this.boxes[i].scaling = new BABYLON.Vector3(1, 1, 1); 
                      }
                  }*/

                break;
            case "r":

             
                break;
        }
    }

    private t: number;

    private control(): void {

      

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(-175, 50, -175));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - compiled for asm.js - press S and wait (don't interact with the scene) for the perf in ms";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => this.key_up(evt)));
    }

    private bb = true; 

    private test(): void {

        if (this.bb) {

            var t = true;
            for (var i = 0; i < this.boxes.length; i++) {

                if (this.boxes[i].isVisible) {
                    t = false;
                    break;
                }
            }

            if (t) {
                console.log(Date.now() - this.t1);
                var r = Date.now() - this.t1;
                document.getElementById("control").innerHTML = "time elapsed to achieve the stress test with asm.js : " + r + " ms";; 

                this.bb = false; 
            }
        }

    }

}