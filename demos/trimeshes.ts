class Trimeshes {

    private scene: BABYLON.Scene;
    private energy: Energy;

    private meshes: BABYLON.AbstractMesh[] = [];

    private assetsManager: BABYLON.AssetsManager;


    constructor(scene: BABYLON.Scene) {


      

        this.scene = scene;



        this.control();

        var contactFlagMode = dContactBounce;

        //init physic engine in quickstemode (faster but less accurate)
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        //  this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.033, 1);
        this.energy.setMaxContact(6);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);





        var materials: Materials = new Materials(this.scene);

        new Heighmap(this.scene, this.energy, true);

       
        //cube mesh 
        var side = 4;
        var cube: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", side, this.scene);
        cube.material = materials.matBlue;
        cube.isVisible = false;

        for (var i = 0; i < 1; i++) {
            for (var x = 0; x < 4; x++) {
                for (var y = 0; y < 4; y++) {
                    for (var z = 0; z < 4; z++) {
                        var instance: BABYLON.InstancedMesh;
                        var position = new BABYLON.Vector3((i * 5) + x * side + 5, y * side + 8, z * side);
                        instance = cube.createInstance("cube");
                        instance.position = position;
                        this.energy.addDynamicObject(instance, Energy.BOX, 1);
                        this.energy.dBodySetSurfaceParameter(instance, mu, 20);
                        this.energy.dBodySetSurfaceParameter(instance, bounce, 0.1);
                        this.energy.dBodySetSurfaceParameter(instance, bounce_vel, 0.1);
                        this.energy.dBodyDisable(instance);
                       
                        instance.isPickable = false;
                    }
                }
            }
        }

       


      

        this.assetsManager = new BABYLON.AssetsManager(scene);

        var loadMesh = this.assetsManager.addMeshTask("load", "", "assets/", "a44.babylon");
        loadMesh.onSuccess = (task) => this.fileIsLoaded(task);
        this.assetsManager.load();

    }

    private fileIsLoaded(task: any): void {


        var materials: Materials = new Materials(this.scene);
        for (var j = 0; j < 10; j++)
            for (var i = 0; i < task.loadedMeshes.length; i++) {
                var trimesh = <BABYLON.Mesh>task.loadedMeshes[i];
                trimesh.isVisible = false;
                trimesh.material = materials.matRed; 
                //  trimesh.scaling = new BABYLON.Vector3(s, s, s);
                var ins = trimesh.createInstance("");
                this.energy.addDynamicTriMesh(ins, 1);
                var s = 0.1;  // Math.random() * 1 + 0.3; 
                this.meshes.push(ins);
                this.energy.dBodySetSurfaceParameter(ins, mu, 5000);
                this.energy.dBodySetSurfaceParameter(ins, bounce, 0.5);
                this.energy.dBodySetPosition(ins, new BABYLON.Vector3(Math.random() * 120, 25, Math.random() * 120));
            }

        this.energy.startSimulation();
    }
    


    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(100, 30, 100));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Trimeshes & Heighmap - q,s(up +y),d move ";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => this.key_up(evt)));
    }

    private key_up(event: any): void {

        console.log("clic", this.meshes.length);

       
        var key = event.sourceEvent.key;


        switch (key) {
            case "q":

                for (var i = 0; i < this.meshes.length; i++) {
                    this.energy.dBodyAddForce(this.meshes[i], new BABYLON.Vector3(10000, 0, 0), false);
                    this.energy.dBodyEnable(this.meshes[i]);
                }
                break;
            case "s":

                for (var i = 0; i < this.meshes.length; i++) {
                    this.energy.dBodyAddForce(this.meshes[i], new BABYLON.Vector3(0, 10000, 0), false);
                    this.energy.dBodyEnable(this.meshes[i]);
                }
               

                break;
            case "d":

                for (var i = 0; i < this.meshes.length; i++) {
                    this.energy.dBodyAddForce(this.meshes[i], new BABYLON.Vector3(-10000, 0, 0), false);
                    this.energy.dBodyEnable(this.meshes[i]);
                }
                break;
           
        }
    }


    
}











