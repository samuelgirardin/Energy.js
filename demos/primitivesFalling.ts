class PrimitivesFalling {

    private scene: BABYLON.Scene;
    private energy: Energy; 
   

    constructor(scene: BABYLON.Scene, energy: Energy) {

        this.scene = scene;
        this.energy = energy;

        var materials: Materials = new Materials(this.scene);

        //sphere
        var radius = .4
        var sphere_blue: BABYLON.Mesh = BABYLON.Mesh.CreateSphere("", 8, side, this.scene);
        sphere_blue.isVisible = false;
        sphere_blue.material = materials.matBlue;

        //cube
        var side =.5;
        var cube: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", side, this.scene);
        cube.material = materials.matBlue;
        cube.isVisible = false;

        for (var i = 0; i < 5; i++) {
            for (var x = 0; x < 7; x++) {
                for (var y = 0; y < 7; y++) {
                    for (var z = 0; z < 3; z++) {
                        var instance: BABYLON.InstancedMesh;
                        var position = new BABYLON.Vector3((i*5)+ x *side+5, y *side , z *side);
                        instance = cube.createInstance("cube");
                        instance.position = position;
                        this.energy.addDynamicObject(instance, Energy.BOX, 1);
                        //this.energy.assignPhysicMaterialToMesh(pmat.dxMaterial, instance);
                        instance.isPickable = false;
                    }
                }
            }
        }
    }

}