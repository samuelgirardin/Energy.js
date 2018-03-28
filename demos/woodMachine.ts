class WoodMachine {

    private scene: BABYLON.Scene;
    private energy: Energy;

    private slaveGear1: BABYLON.InstancedMesh;
    private slaveGear2: BABYLON.InstancedMesh;
    private masterGear: BABYLON.InstancedMesh;

    private woodStick1: BABYLON.Mesh;
    private woodStick2: BABYLON.Mesh;

    private pusher1: BABYLON.Mesh;
    private pusher2: BABYLON.Mesh;

    // speciif to transmission joint
    private ratio = 1;
    private speed = 8;




    constructor(scene: BABYLON.Scene) {

        this.scene = scene;

        this.control(); 

        var contactFlagMode = dContactBounce;

        //init physic engine in quickstemode (faster but less accurate)
       // this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0),  Energy.NORMAL_STEP,contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.016, 1);
        this.energy.setMaxContact(16);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);

        // create the machine and add the  primitive to energy
        this.addWoodBalls();
        this.addWoodColumn();
        this.addGearing();
        this.addWoodstickAndPusher();

        //create joint
        this.addJoints()

        this.energy.startSimulation();

    }

    private addJoints(): void {


        // pivot for the 3 cylinder  
        var axis = new BABYLON.Vector3(0, 1, 0); // common to the 3 cylinders y up  
        var anchor = new BABYLON.Vector3(2, 1, 0);                 
        var centerHingeslaveGear1 = this.energy.addDJointHinge(this.slaveGear1, null, anchor, axis, "");  // null hinge is attached to body and world (world is static aka fix position)

        anchor = new BABYLON.Vector3(-2, 1, 0);       
        var centerHingeslaveGear2 = this.energy.addDJointHinge(this.slaveGear2, null, anchor, axis, "");  

        anchor = new BABYLON.Vector3(0, 1, 0);       
        var centerHingeMasterGear = this.energy.addDJointHinge(this.masterGear, null, anchor, axis, ""); 
        
        
        // conection between a gear and his wood stick
        axis = new BABYLON.Vector3(0, 1, 0);
        anchor = new BABYLON.Vector3(2, 0.15, 1); 
        var wStick1SlaveGear1 = this.energy.addDJointHinge(this.woodStick1, this.slaveGear1, anchor, axis, ""); 
        
        anchor = new BABYLON.Vector3(-2, 0.15, -1); 
        var wStick2SlaveGear2 = this.energy.addDJointHinge(this.woodStick2, this.slaveGear2, anchor, axis, ""); 

        //conection between woodstick and pusher
        axis = new BABYLON.Vector3(0, 1, 0);
        anchor = new BABYLON.Vector3(2, 0.15, 5); 
        var wStick1Pusher1 = this.energy.addDJointHinge(this.woodStick1, this.pusher1, anchor, axis, "");

        anchor = new BABYLON.Vector3(-2, 0.15, 3);
        var wStick2Pusher2 = this.energy.addDJointHinge(this.woodStick2, this.pusher2, anchor, axis, ""); 


        //trnasmission of the angular velocity (master wheel) to each slaves wheel          
        axis = new BABYLON.Vector3(0, 1, 0);
        var anchor1 = this.slaveGear1.position;
        var anchor2 = this.masterGear.position; 
        var masterToSlave1 = this.energy.addDJointTransmission(this.slaveGear1, this.masterGear, dTransmissionParallelAxes, this.ratio, anchor1, anchor2, axis, "t1");

        anchor1 = this.slaveGear2.position;
        anchor2 = this.masterGear.position;
        var masterToSlave2 = this.energy.addDJointTransmission(this.slaveGear2, this.masterGear, dTransmissionParallelAxes, this.ratio, anchor1, anchor2, axis, "t2");
        

        //slider joint to constraint pusher axe
        axis = new BABYLON.Vector3(0, 0, 1);
        var slider_pusher1 = this.energy.addDJointSlider(this.pusher1, null, axis, "");         
        
        var slider_pusher2 = this.energy.addDJointSlider(this.pusher2, null, axis, "");  


        //add velocity to the master wheel 
        this.energy.dJointSetParam(centerHingeMasterGear, dParamVel, this.speed); 
        this.energy.dJointSetParam(centerHingeMasterGear, dParamFMax, 100000); 

      

    }

   


    private addGearing(): void {


        var materials = new Materials(this.scene);
        
         // the tree cylindrer gears

        var cylinder = BABYLON.Mesh.CreateCylinder("", .1, 2, 2, 64, 1, this.scene);
        cylinder.material = materials.wood;
        cylinder.isVisible = false;

        this. masterGear = cylinder.createInstance("master");
        this. slaveGear1 = cylinder.createInstance("salve1");
        this.slaveGear2 = cylinder.createInstance("slave2");



        this.masterGear.position = new BABYLON.Vector3(0,.3, 0);
        this.slaveGear1.position = new BABYLON.Vector3(2, .3, 0);
        this. slaveGear2.position = new BABYLON.Vector3(-2, .3, 0);

        this.energy.addDynamicObject(this.masterGear, Energy.CYLINDER, 10, 1);
        this.energy.addDynamicObject(this.slaveGear1, Energy.CYLINDER, 10, 1);
        this.energy.addDynamicObject(this.slaveGear2, Energy.CYLINDER, 10, 1);
    }

    private addWoodstickAndPusher(): void {

        var materials = new Materials(this.scene);

        this. woodStick1 = BABYLON.Mesh.CreateBox("woodstick1", 1, this.scene);
        this.woodStick1.scaling = new BABYLON.Vector3(.04, .04, 4);
        this.woodStick1.position = new BABYLON.Vector3(2, 0.15, 3);


        this.pusher1 = BABYLON.Mesh.CreateBox("pusher", 1, this.scene);
        this.pusher1.scaling = new BABYLON.Vector3(.4, .4, 1);
        this.pusher1.position = new BABYLON.Vector3(2, 0.3, 5.5);
        this.pusher1.material = materials.wood;

        this.woodStick2 = BABYLON.Mesh.CreateBox("woodstick2", 1, this.scene);
        this.woodStick2.scaling = new BABYLON.Vector3(.04, .04, 4);
        this.woodStick2.position = new BABYLON.Vector3(-2, 0.15, 1);

        this.pusher2 = BABYLON.Mesh.CreateBox("pusher1", 1, this.scene);
        this.pusher2.scaling = new BABYLON.Vector3(.4, .4, 1);
        this.pusher2.position = new BABYLON.Vector3(-2, 0.3, 3.5);
        this.pusher2.material = materials.wood;

        this.energy.addDynamicObject(this.woodStick1, Energy.BOX, 1);
        this.energy.addDynamicObject(this.pusher1, Energy.BOX, 1);
        this.energy.addDynamicObject(this.woodStick2, Energy.BOX, 1);
        this.energy.addDynamicObject(this.pusher2, Energy.BOX, 1);
       
    }


       


    private addWoodBalls(): void {

        var materials = new Materials(this.scene);


        var sphere = BABYLON.Mesh.CreateSphere("spehere", 8, .60, this.scene);
        sphere.material = materials.matRed; 
        sphere.isVisible = false;

        for (var i = 0; i < 17; i++) {

            var instance = sphere.createInstance("000");
            instance.position = new BABYLON.Vector3(2, i / 1, 5.725); 
             
            this.energy.addDynamicObject(instance, Energy.SPHERE, 1); 
            this.energy.dBodySetSurfaceParameter(instance, mu, 250);  
            
            
        
        }


        for (var i = 0; i < 17; i++) {

            var instance = sphere.createInstance("111");
            instance.position = new BABYLON.Vector3(-2, i / 1, 5.725);
            this.energy.addDynamicObject(instance, Energy.SPHERE, 1); 
             this.energy.dBodySetSurfaceParameter(instance, mu, 250);  
        
        } 

    }

    private addWoodColumn(): void {

        var b0: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1,this. scene);
        b0.scaling = new BABYLON.Vector3(.02, 10, .02);
        b0.position = new BABYLON.Vector3(2.25, 5.6, 5.5);
        this.energy.addDynamicObject(b0, Energy.BOX, 0); 

        var b1: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this.scene);
        b1.scaling = new BABYLON.Vector3(.02, 10, .02);
        b1.position = new BABYLON.Vector3(2.25, 5.6, 5.95);
        this.energy.addDynamicObject(b1, Energy.BOX, 0); 

        var b2: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this. scene);
        b2.scaling = new BABYLON.Vector3(.02, 10, .02);
        b2.position = new BABYLON.Vector3(1.75, 5.6, 5.95);
        this.energy.addDynamicObject(b2, Energy.BOX, 0); 

        var b3: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this. scene);
        b3.scaling = new BABYLON.Vector3(.02, 10, .02);
        b3.position = new BABYLON.Vector3(1.75, 5.6, 5.5);
        this.energy.addDynamicObject(b3, Energy.BOX, 0); 



        var b4: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this. scene);
        b4.scaling = new BABYLON.Vector3(.02, 10, .02);
        b4.position = new BABYLON.Vector3(-1.75, 5.6, 5.5);
        this.energy.addDynamicObject(b4, Energy.BOX, 0); 

        var b5: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this. scene);
        b5.scaling = new BABYLON.Vector3(.02, 10, .02);
        b5.position = new BABYLON.Vector3(-1.75, 5.6, 5.95);
        this.energy.addDynamicObject(b5, Energy.BOX, 0); 

        var b6: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this.scene);
        b6.scaling = new BABYLON.Vector3(.02, 10, .02);
        b6.position = new BABYLON.Vector3(-2.25, 5.6, 5.95);
        this.energy.addDynamicObject(b6, Energy.BOX, 0); 

        var b7: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this. scene);
        b7.scaling = new BABYLON.Vector3(.02, 10, .02);
        b7.position = new BABYLON.Vector3(-2.25, 5.6, 5.5);
        this.energy.addDynamicObject(b7, Energy.BOX, 0); 

    }

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(15, 15, 15));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Wood machine ";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));
    }

    private key_up(event: any): void {
    }

}