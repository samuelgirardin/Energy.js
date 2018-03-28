class Tuto6_contact_cfm_erp {

    private energy: Energy;
    private boxes: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();


    /**
     * @dContactSoftERP : the error reduction parameter of the contact normal can be set with the soft_erp parameter.
     * @This is useful to make surfaces soft.
     * @dContactSoftCFM :If set, the constraint force mixing parameter of the contact normal can be set with the soft_cfm parameter.
     * @This is useful to make surfaces soft.
     * @Contact by nature are hard in a physic engine, those two parameters soften the contact, like a little
     * @amount of interpenetration
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
        for (var i = -7; i < 5; i = i + 2) {
            for (var j = -7; j < 5; j = j + 2) {

                //meshes creation - 25 boxes
                var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, scene);
                box.material = materials.matBlue;
                box.position = new BABYLON.Vector3(i, 5, j);
                this.boxes.push(box);

                //add the boxes to the simulation - dynamicObjects are created with their own physic material with the mu parameter(friction) at 1 -
                this.energy.addDynamicObject(box, Energy.BOX, 1);
            }
        }

        //set cfm and erp in the switch case in key_up
        // gloabally we can say that soft_cfm deals with 'how my contact between to geom is hard'. If it s set to 0 th contact is hard.
        // generally we need more soft contact.  

       
      
    }

    private key_up(event: any): void {

        var key = event.sourceEvent.key;

        console.log(event);

        switch (key) {
            case "a":
                this.resetSimulation(); 
                for (var i = 0; i < this.boxes.length; i++) {                   
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_cfm, 0.05);
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_erp, i / (this.boxes.length - 1));
                    
                }
                this.energy.startSimulation();              
                break;
            case "b":
                this.resetSimulation(); 
                for (var i = 0; i < this.boxes.length; i++) {
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_cfm, 0.5);
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_erp, i / (this.boxes.length - 1));

                }
                this.energy.startSimulation();
                break;
            case "c":
                this.resetSimulation(); 
                for (var i = 0; i < this.boxes.length; i++) {
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_cfm, 0.9);
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_erp, i / (this.boxes.length - 1));

                }
                this.energy.startSimulation();
                break;
            case "d":
                this.resetSimulation(); 
                for (var i = 0; i < this.boxes.length; i++) {
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_cfm, i / (this.boxes.length - 1));
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_erp, 0.05);

                }
                this.energy.startSimulation();
                break;
            case "e":
                this.resetSimulation(); 
                for (var i = 0; i < this.boxes.length; i++) {
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_cfm, i / (this.boxes.length - 1));
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_erp, 0.5);

                }
                this.energy.startSimulation();
                break;
            case "f":
                this.resetSimulation(); 
                for (var i = 0; i < this.boxes.length; i++) {
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_cfm, i / (this.boxes.length - 1));
                    this.energy.dBodySetSurfaceParameter(this.boxes[i], soft_erp, 0.9);

                }
                this.energy.startSimulation();
                break;
            case "r":
                this.resetSimulation();              
                break;
        }
    }

    private resetSimulation(): void {
        var n = 0;
        for (var i = -7; i < 5; i = i + 2) {
            for (var j = -7; j < 5; j = j + 2) {
                this.energy.dBodySetZeroForce(this.boxes[n]);
                this.energy.dBodySetPosition(this.boxes[n], new BABYLON.Vector3(i, 5, j));
                this.energy.dBodySetQuaternion(this.boxes[n], BABYLON.Quaternion.Identity())
                n++;
            }
        }
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

        document.getElementById("control").innerHTML = "energy.js - Contact cfm & erp  <br>note 1 : cfm near 0 = hard contact <br>note 2 : box is passing through the ground? erp=0 or near 0 associated with high cfm<br>note 3 : box is bouncing case(f) cfm is set to 0 (hard contact) with a high erp  <br> (a)  cfm: 0.05 erp: 0 ->1  <br> (b)  cfm: 0.5 erp: 0 ->1 <br> (c)  cfm: 0.9 erp: 0 ->1 <br>(d)'  cfm: 0->1 erp: 0.05 <br>(e)  cfm: 0->1 erp: 0.5 <br>(f)  cfm: 0->1 erp: 0.9 <br>(r) reset";

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));
        // -x x helper
        //var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 1, this.scene);
        //box.position = new BABYLON.Vector3(-2, 0.5, 0);
        //var box: BABYLON.Mesh = BABYLON.Mesh.CreateBox("", 4, this.scene);
        //box.position = new BABYLON.Vector3(2, 0.5, 0);

    }

}