class Vehicle {

    private scene: BABYLON.Scene;
    private energy: Energy;

    private carBodies: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();
    private carJoints: Array<DxJoint> = new Array<DxJoint>();

    private assetsManager: BABYLON.AssetsManager;

    // wheel meshes
    private wm1: BABYLON.Mesh;
    private wm2: BABYLON.Mesh;
    private wm3: BABYLON.Mesh;
    private wm4: BABYLON.Mesh;
    private wm5: BABYLON.Mesh;
    private wm6: BABYLON.Mesh;

    // joints util
    private anchor1: BABYLON.Vector3;
    private anchor2: BABYLON.Vector3;
    private axis1: BABYLON.Vector3;

    private points: Array<BABYLON.InstancedMesh> = new Array<BABYLON.InstancedMesh>(); 

    constructor(scene: BABYLON.Scene) {

        /**
       *  Basic 6 wheels vehicle implementation
       *  Not really efficient, better to use dynamic ray (TODO) 
       */

        var contactFlagMode = dContactBounce | dContactSoftCFM | dContactSoftERP;

        this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 120);
        // normal step mode (more precise)
      //  this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0),  Energy.NORMAL_STEP,contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.030, 1);
        this.energy.setMaxContact(16);

        //parameter for energy to disable idle body // see doc 

        //dWorldSetAutoDisableFlag must be set to initiate the process
        this.energy.dWorldSetAutoDisableFlag(0);

        //see other parameter in the different testcase in


       // this.energy.dWorldSetAutoDisableAverageSamplesCount(10);
        // this.energy.dWorldSetAutoDisableSteps(50);
        // this.energy.dWorldSetAutoDisableTime(50);
       // this.energy.dWorldSetAutoDisableLinearThreshold(0.15);
       // this.energy.dWorldSetAutoDisableAngularThreshold(0.15);


        this.scene = scene;
        // this.energy = energy;

        this.assetsManager = new BABYLON.AssetsManager(scene);

        // build car
        new Heighmap(this.scene, this.energy, true);

        this.buildCar();

        // load wheels meshes
        var meshTask = this.assetsManager.addMeshTask("load", "", "assets/", "wheel1.babylon");
        meshTask.onSuccess = (task) => this.wheelLoaded(task);
        this.assetsManager.load();

        var materials: Materials = new Materials(this.scene);

        //sphere
        var radius = .8
        var sphere_blue: BABYLON.Mesh = BABYLON.Mesh.CreateSphere("", 8, side, this.scene);
        sphere_blue.isVisible = true;
        sphere_blue.material = materials.matBlue;

        //cube
        var side = 1;
        var cube: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", side, this.scene);
        cube.material = materials.matBlue;
        cube.isVisible = false;

       
        this.build() ;

        this.energy.startSimulation();

        this.scene.registerBeforeRender(() => this.setBuggyUI());

     //   this.scene.registerBeforeRender(() => this.collision());

    }

    private build(): void {



        var materials: Materials = new Materials(this.scene);
        var side = 1;
        var cube: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", side, this.scene);
        cube.material = materials.matRed;
        cube.isVisible = false;
        //create instance
        for (var i = 0; i < 1000; i++) {
            var instance: BABYLON.InstancedMesh;
            //var position = new BABYLON.Vector3(Energy.Col[i], Energy.Col[i + 2], Energy.Col[i + 1]);
            instance = cube.createInstance("cube");
            // instance.position = position;
            instance.isPickable = false;
            this.points[i] = instance;
        }

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

    private setBuggyUI(): void {

        // 



        //all of that is register to be call at each frame
        this.steeringControl();
        this.engineControl();
        this.swaybarControl();


        this.energy.dBodyEnable(this.carBodies[0]);


        //if the car is flipped
        if (Control.FlipCar == 1) {
            this.energy.dBodyAddTorque(this.carBodies[0], new BABYLON.Vector3(9600, 0, 0), true);


            this.energy.dBodyAddForce(this.carBodies[0], new BABYLON.Vector3(0, 9500, 0), true);
        }
    }

    private buildCar(): void {

        // mat
        var materials: Materials = new Materials(this.scene);

        // car setup       

        var wheelRadius = 0.3;
        var wpos1: BABYLON.Vector3 = new BABYLON.Vector3(-1, 2.5, 11.1);
        var wpos2: BABYLON.Vector3 = new BABYLON.Vector3(-1, 2.5, 8.9);
        var wpos3: BABYLON.Vector3 = new BABYLON.Vector3(1, 2.5, 11.1);
        var wpos4: BABYLON.Vector3 = new BABYLON.Vector3(1, 2.5, 8.9);
        //  var wpos5: BABYLON.Vector3 = new BABYLON.Vector3(2.4, 2.5, 10.9);
        //  var wpos6: BABYLON.Vector3 = new BABYLON.Vector3(2.4, 2.5, 9.1);
        var wheelsPos = new Array<BABYLON.Vector3>(null, wpos1, wpos2, wpos3, wpos4/*, wpos5, wpos6*/);

        // main body
        var car: BABYLON.Mesh = BABYLON.Mesh.CreateBox("car", 1, this.scene);
        var carScale = new BABYLON.Vector3(2.4, 1, 1.4);
          // Lights.ShadowGenerator.getShadowMap().renderList.push(car);
        car.scaling = carScale;
        car.position = new BABYLON.Vector3(0, 3, 10);
        this.carBodies.push(car);
        this.energy.addDynamicObject(car, Energy.BOX, 50);

        this.energy.dBodySetSurfaceParameter(car, mu, 500);

        //assign cam 
        Cameras.cameraF.lockedTarget = car;

        //wheels
        for (var i = 1; i <= 4; i++) {
            var tempWheel = BABYLON.Mesh.CreateSphere("wheel" + i, 16, wheelRadius * 3, this.scene);
            tempWheel.material = materials.matBlue;
            tempWheel.position = wheelsPos[i];
            tempWheel.isVisible = false;
            this.carBodies[i] = tempWheel;
            //  Lights.ShadowGenerator.getShadowMap().renderList.push(tempWheel);
            this.energy.addDynamicObject(tempWheel, Energy.SPHERE, 40);
          //  this.energy.dBodySetSurfaceParameter(tempWheel, bounce, 0.5);
            this.energy.dBodySetSurfaceParameter(tempWheel, mu, 750);
            this.energy.dBodySetSurfaceParameter(tempWheel, soft_cfm, 0.0001);
            this.energy.dBodySetSurfaceParameter(tempWheel, soft_erp, 0.90);
           
            this.energy.dBodySetGyroscopicMode(tempWheel, 0); 
            this.energy.dBodySetFiniteRotationMode(tempWheel, 0); 

          

        }

        //wheel joints
        for (var i = 0; i < 4; i++) {

            var wpos = this.carBodies[i + 1].position;
            var axis1 = new BABYLON.Vector3(0, 1, 0);
            var axis2 = new BABYLON.Vector3(0, 0, i % 2 == 0 ? -1 : 1);
            this.carJoints[i] = this.energy.addDJointHinge2(this.carBodies[0], this.carBodies[i + 1], wpos, axis1, axis2, "wheeljoint" + i);
            this.energy.dJointSetParam(this.carJoints[i], dParamLoStop, 0);
            this.energy.dJointSetParam(this.carJoints[i], dParamHiStop, 0);
            this.energy.dJointSetParam(this.carJoints[i], dParamFMax, 50);

            this.energy.dJointSetParam(this.carJoints[i], dParamVel2, 0);
            //   this.energy.dJointSetParam(this.carJoints[i], dParamFMax2, 30);

            this.energy.dJointSetParam(this.carJoints[i], dParamSuspensionERP, 0.22);
            this.energy.dJointSetParam(this.carJoints[i], dParamSuspensionCFM, 0.004);

        }
    }

    private wheelLoaded(task: any): void {

        var wm = <BABYLON.Mesh>task.loadedMeshes[0];
        wm.isVisible = false;
        this.wm1 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm2 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm3 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm4 = task.loadedMeshes[0].createInstance("", this.scene);

       /* this.wm1.isVisible = false; 
        this.wm2.isVisible = false; 
        this.wm3.isVisible = false; 
        this.wm4.isVisible = false; */

        // this.wm5 = task.loadedMeshes[0].createInstance("", this.scene);
        // this.wm6 = task.loadedMeshes[0].createInstance("", this.scene);


        /*  Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm1);
          Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm2);
          Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm3);
          Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm4);
          Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm5);
          Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm6);*/


        this.wm1.parent = this.carBodies[1];
        this.wm2.parent = this.carBodies[2];
        this.wm3.parent = this.carBodies[3];
        this.wm4.parent = this.carBodies[4];
        //  this.wm5.parent = this.carBodies[5];
        //  this.wm6.parent = this.carBodies[6];



    }

    private swaybarControl(): void {

        var amt: number;
        for (var i = 0; i < 2; i++) {
            // get proporties for swaybar.
            var h2anchor = this.energy.getdjointHinge2Anchor(this.carJoints[i]);
            this.anchor1 = new BABYLON.Vector3(h2anchor[0], h2anchor[1], h2anchor[2]);

            var h2anchor2 = this.energy.getdjointHinge2Anchor2(this.carJoints[i]);
            this.anchor2 = new BABYLON.Vector3(h2anchor2[0], h2anchor2[1], h2anchor2[2]);

            var ax1 = this.energy.getdjointHinge2Axis1(this.carJoints[i]);
            this.axis1 = new BABYLON.Vector3(ax1[0], ax1[1], ax1[2]);

            var dif = this.anchor1.subtract(this.anchor2);
            var displacement = (dif.x * this.axis1.x) + (dif.y * this.axis1.y) + (dif.z * this.axis1.z);

            if (displacement > 0) {
                amt = displacement * 800;
              //  console.log(amt)

                //  amt > 50 ? amt = 250 : 0;
               // console.log("d")
                var force = this.axis1.scaleInPlace(amt);

                this.energy.dBodyAddForce(this.carBodies[i + 1], force.negate(), false);
            }
        }
    }

    private steeringControl(): void {

        var steeringRate = Math.PI * 4 / 7;
        var steeringLimit = Math.PI / 12;


        for (var i = 0; i < 4; i++) {

            if (i >= 2) {
                // the two front wheels                       
                var steering = Control.Steering;

                /*   if (Math.abs(steering) < 0.1) {
                       steering = 0;
                   }*/

                var desiredPosition = steering * ((i > 1) ? -1 : 1);
                var steeringVelocity = (desiredPosition - this.energy.dJointGetHinge2Angle1(this.carJoints[i])) * 10;

                this.energy.dJointSetParam(this.carJoints[i], dParamHiStop, steeringLimit);
                this.energy.dJointSetParam(this.carJoints[i], dParamLoStop, -steeringLimit);
                this.energy.dJointSetParam(this.carJoints[i], dParamVel, steeringVelocity);
            }
            else {

                // try to keep the 2  rear wheels straight 
                var desiredPosition = 0;
                var steeringVelocity = (desiredPosition - this.energy.dJointGetHinge2Angle1(this.carJoints[i])) * 10;
                this.energy.dJointSetParam(this.carJoints[i], dParamHiStop, 0.1);
                this.energy.dJointSetParam(this.carJoints[i], dParamLoStop, -0.1);
                this.energy.dJointSetParam(this.carJoints[i], dParamVel, steeringVelocity);

            }
        }

    }

    private engineControl(): void {

        var velocity = Control.Velocity;
        var wheelVelocity = 15 * Math.PI * velocity;
        if (velocity != 0) {

            for (var i = 0; i < 4; ++i) {
                //acceleration  0-1 rear wheels 2-3 front wheels 
                this.energy.dJointSetParam(this.carJoints[i], dParamVel2, ((i % 2) == 0) ? -wheelVelocity : wheelVelocity);
                this.energy.dJointSetParam(this.carJoints[i], dParamFMax2, 150);
            }
        } else {
            for (var i = 0; i < 4; ++i) {
                // free wheel
                this.energy.dJointSetParam(this.carJoints[i], dParamFMax2, 20);
                this.energy.dJointSetParam(this.carJoints[i], dParamVel2, ((i % 2) == 0) ? 0 : 0);
            }
        }

    }



}