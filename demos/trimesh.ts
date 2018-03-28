class Trimesh {

    private scene: BABYLON.Scene;
    private energy: Energy; 

    private assetsManager: BABYLON.AssetsManager;

    constructor(scene: BABYLON.Scene, energy: Energy) {

        this.scene = scene;
        this.energy = energy; 
        this.assetsManager = new BABYLON.AssetsManager(scene);

        var loadMesh = this.assetsManager.addMeshTask("load", "", "assets/", "a1.babylon");
        loadMesh.onSuccess = (task) => this.fileIsLoaded(task);
        this.assetsManager.load(); 

    }

    private fileIsLoaded(task: any): void {         


        for (var j = 0; j < 10; j++)
        for (var i = 0; i < task.loadedMeshes.length; i++) {             
            var trimesh = <BABYLON.Mesh>task.loadedMeshes[i];
            trimesh.isVisible = false; 
          //  trimesh.scaling = new BABYLON.Vector3(s, s, s);
            var ins = trimesh.createInstance(""); 
            this.energy.addDynamicTriMesh(ins, 10);
            var s = 0.1;  // Math.random() * 1 + 0.3; 
           
            this.energy.dBodySetSurfaceParameter(ins, mu, 5000);
            this.energy.dBodySetSurfaceParameter(ins, bounce, 0.7);
            this.energy.dBodySetPosition(ins, new BABYLON.Vector3(Math.random() * 60,5, Math.random() * 60));
        }
    }



}