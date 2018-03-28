class Tuto7_contact_cfm_erp2 {

    private energy: Energy;

    private sphere1: BABYLON.Mesh;
    private sphere2: BABYLON.Mesh;



    /**
     * @ A practical case to show the use of erp and cfm
     * @ 2 spheres rolling to a ramp with a small ground offset. One pass the ramp, the other don't. Same force is applied  
     * @
     * @dContactSoftERP : the error reduction parameter of the contact normal can be set with the soft_erp parameter.
     * @This is useful to make surfaces soft.
     * @dContactSoftCFM :If set, the constraint force mixing parameter of the contact normal can be set with the soft_cfm parameter.
     * @This is useful to make surfaces soft.
     * @Contact by nature are hard in a physic engine, those two parameters soften the contact, like a little
     * @amount of interpenetration, to get some stability. 
     * @soft contact doesn't mean sofbody !
     */

    constructor(private scene: BABYLON.Scene) {

        //camera & keyhandler helper & screen info
        this.control(); 

        // defined contactflag mode This must always be set. This is a combination of one or more of the following see energy/TypeDef.ts (dContact...)

        // contactFlagMode is set to :
        var contactFlagMode = dContactSoftCFM | dContactSoftERP

        //init physic engine in quickstemode (faster but less accurate)
        // this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0), Energy.NORMAL_STEP, contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.030, 1);
        this.energy.setMaxContact(6);

        // add plane as ode geom // No babylon mesh is created here see tuto_addStaticPlane
        this.energy.addStaticPlane(0, 0, 1, 0);

        var materials: Materials = new Materials(scene);       

        //meshes creation - 
        this.sphere1 = BABYLON.Mesh.CreateSphere("",16, 1, this.scene);
        this.sphere2 = BABYLON.Mesh.CreateSphere("", 16, 1, this.scene);

        this.sphere1.material = materials.matRed;
        this.sphere2.material = materials.matBlue;

        this.sphere1.position = new BABYLON.Vector3(0, 0.5, -2);
        this.sphere2.position = new BABYLON.Vector3(0, 0.5, 2);

        //ramp creation a simple rotated box
        var ramp = BABYLON.Mesh.CreateBox("ramp", 1, this.scene);
        ramp.scaling = new BABYLON.Vector3(4, 0.5, 8);
        ramp.position = new BABYLON.Vector3(10, 0.9, 0);
        ramp.rotation.z = Math.PI / 8; 

        // add spheres to energy
        this.energy.addDynamicObject(this.sphere1, Energy.SPHERE, 1);
        this.energy.addDynamicObject(this.sphere2, Energy.SPHERE, 1);
        // the ramp , is a 'static object', is added to the simulation with a density of 0
        this.energy.addDynamicObject(ramp, Energy.BOX, 0);

        //set surface cfm and erp and mu to control friction parameter
        this.energy.dBodySetSurfaceParameter(this.sphere1, mu, 500);
        this.energy.dBodySetSurfaceParameter(this.sphere1, soft_cfm, 0.02);
        this.energy.dBodySetSurfaceParameter(this.sphere1, soft_erp, 0.9);

        this.energy.dBodySetSurfaceParameter(this.sphere2, mu, 500);
        this.energy.dBodySetSurfaceParameter(this.sphere2, soft_cfm, 0.2);
        this.energy.dBodySetSurfaceParameter(this.sphere2, soft_erp, 0.8);
        
    }

    private key_up(event: any): void {

        var key = event.sourceEvent.key;

        switch (key) {
            case "s":
                //  this.resetSimulation(); 
                this.energy.dBodyAddForce(this.sphere1, new BABYLON.Vector3(400, 0, 0));
                this.energy.dBodyAddForce(this.sphere2, new BABYLON.Vector3(400, 0, 0))
                this.energy.startSimulation();              
                break;
            case "r":
                this.resetSimulation();              
                break;
        }
    }

    private resetSimulation(): void {
        
        this.energy.dBodySetZeroForce(this.sphere1);
        this.energy.dBodySetPosition(this.sphere1, new BABYLON.Vector3(0, 0.5, -2));
        this.energy.dBodySetQuaternion(this.sphere1, BABYLON.Quaternion.Identity());

        this.energy.dBodySetZeroForce(this.sphere2);
        this.energy.dBodySetPosition(this.sphere2, new BABYLON.Vector3(0, 0.5, 2));
        this.energy.dBodySetQuaternion(this.sphere2, BABYLON.Quaternion.Identity());
               
        this.energy.pauseSimulation();
        // just top update one step as the simulation is paused , to get the sphere a their ini positions
        this.energy.simloop();
    }

    private control(): void {

        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.setPosition(new BABYLON.Vector3(-15, 7, -15));
        camera.speed = 0.5;
        camera.maxZ = 2000;
        camera.inertia = 0.7;

        document.getElementById("control").innerHTML = "energy.js - Contact cfm & erp 2  <br><br>red sphere : cfm 0.02, erp 0.9<br>blue sphere cfm 0.2, erp 0.8 <br>(s) start - (r) reset";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));

       
    }

}