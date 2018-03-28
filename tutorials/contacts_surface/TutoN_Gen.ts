class Tuto {

    private energy: Energy;
    private boxes: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();

   

    constructor(private scene: BABYLON.Scene) {

        //camera & keyhandler helper & screen info
        this.control(); 

        // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)

        // contactFlagMode is set to dContactMu2 to compute mu2 , mu parameter is compute by default
        var contactFlagMode = dContactMu2;

        //init physic engine in quickstemode (faster but less accurate)
         this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
       // this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode);
         this.energy.setTimeStepAndNumStep(0.030, 1);
        this.energy.setMaxContact(110);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);

        this.energy.startSimulation();

    }

    private key_up(event: any): void {

        var key = event.sourceEvent.key;

        console.log(event);

        switch (key) {
            case "s":
                var n = 0;
               
                break;
            case "r":
              

                break;
        }
    }

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(-25, 25, -25));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Friction mu & mu2 - (s) start - (r) reset";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));
    }

}