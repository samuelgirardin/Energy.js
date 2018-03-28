class BallJoint {

    private scene: BABYLON.Scene;
    private energy: Energy;



    private assetsManager: BABYLON.AssetsManager;


    constructor(scene: BABYLON.Scene) {


        var num = 100;

        this.scene = scene;

      

        this.control();

        var contactFlagMode = dContactBounce;

        //init physic engine in quickstemode (faster but less accurate)
         this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
      //  this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.016, 1);
        this.energy.setMaxContact(6);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);





        var materials: Materials = new Materials(this.scene);
        var instance: BABYLON.InstancedMesh;
        var side = .5;
        var sphere: BABYLON.Mesh = BABYLON.Mesh.CreateSphere("", 16, side, this.scene);
        var sphere1: BABYLON.Mesh = BABYLON.Mesh.CreateSphere("", 16, side, this.scene);



        var k: number;
        var anchor: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        var body: Array<BABYLON.InstancedMesh> = new Array<BABYLON.InstancedMesh>();

        sphere.material = materials.matBlue;
        sphere.isVisible = false;
        sphere1.material = materials.matRed;
        sphere1.isVisible = false;

        for (var i = 0; i < num; i++) {
            k = i * side;
            instance = sphere.createInstance("cube");
            instance.position = new BABYLON.Vector3(k, 3, k);
            body[i] = instance;
            this.energy.addDynamicObject(instance, Energy.SPHERE, i == 0 ? 0 : 1);
        }
        // build ball joint
        for (i = 0; i < num - 1; i++) {
            k = (i + 0.5) * side;
            anchor.x = k; anchor.y = 3; anchor.z = k;
            var ballJoint = this.energy.addDJointBall(body[i], body[i + 1], anchor, "");
            this.energy.dJointSetParam(ballJoint, dParamCFM, 0.000001);
            this.energy.dJointSetParam(ballJoint, dParamERP, .99);

        }

        for (var i = num; i < num * 2; i++) {
            k = (i - num) * side;
            instance = sphere1.createInstance("cube");
            instance.position = new BABYLON.Vector3(-k, 3, -k);
            body[i] = instance;
            this.energy.addDynamicObject(instance, Energy.SPHERE, i == num ? 0 : 1);
        }
        // build ball joint
        for (i = num; i < num * 2 - 1; i++) {
            k = (i - num + 0.5) * side;
            anchor.x = - k; anchor.y = 3; anchor.z = -k;
            var ballJoint = this.energy.addDJointBall(body[i], body[i + 1], anchor, "");
            this.energy.dJointSetParam(ballJoint, dParamCFM, 0.5);
            this.energy.dJointSetParam(ballJoint, dParamERP, .5);

        }

       

        this.energy.startSimulation();

        // random force
        scene.registerBeforeRender(() => {

            this.energy.dBodyAddForce(body[num - 1], new BABYLON.Vector3(0, Math.random() * (num * 10), 0), false);
            this.energy.dBodyAddForce(body[num * 2 - 1], new BABYLON.Vector3(0, Math.random() * (num * 10), 0), false);


        });
    }


    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(15, 15, 15));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Balls joint - Blue -> joint CFM 0.0001 ERP 0.99 , Red -> joint CFM 0.5 ERP 0.5 ";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));
    }

    private key_up(event: any): void {

       
    }
}


       
     
   
                       





