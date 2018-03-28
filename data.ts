class Data {

    public static Body: Array<Array<string>> = [
        ["Select a mesh", "", "", "", ""],
        ["Position", "dGeomGetPosition", "dGeomSetPosition", "Mesh_Vector3", ""],
        ["Quaternion", "dBodyGetQuaternion", "dBodySetQuaternion", "Mesh_Vector4", ""],
        ["Linear Velocity", "dBodyGetLinearVel", "dBodySetLinearVel", "Mesh_Vector3", ""],
        ["Angular Velocity", "dBodyGetAngularVel", "dBodySetAngularVel", "Mesh_Vector3", ""],
        ["Mass or Density", "dBodyGetMass", "dBodySetMass", "Mesh_number", ""],
    ];

      public static World: Array < Array < string >> = [
          ["dWorld INFOS", "", "", "", ""],
          ["Timestep", "getTimeStep", "setTimeStep", "number", "Stepsize between each simulation step. Ideally 1/60,0.0166"],
          ["MaxContact", "getMaxContact", "setMaxContact", "number", "Maximum number of contacts allowed between two entities. "],
        ["Gravity", "dWorldGetGravity2", "dWorldSetGravity", "Vector3", "Set and get the world's global gravity vector. In the SI units the Earth's gravity vector would be (0,-9.81,0), assuming that +y is up. The default is no gravity, i.e. (0,0,0)."],
        ["ERP", "dWorldGetERP", "dWorldSetERP", "number", "Set and get the global ERP value, that controls how much error correction is performed in each time step. Typical values are in the range 0.1-0.8. The default is 0.2."],
        ["CFM", "dWorldGetCFM", "dWorldSetCFM", "number", "Set and get the global CFM (constraint force mixing) value. Typical values are in the range 10-9 -- 1. The default is 10-5 if single precision is being used, or 10-10 if double precision is being used."],
        ["AutoDisableFlag", "dWorldGetAutoDisableFlag", "dWorldSetAutoDisableFlag", "number", "Global parameter applied for each world's body - Set and get the auto-disable flag of a body. If the do_auto_disable is nonzero the body will be automatically disabled when it has been idle for long enough.\nDefault parameter : disabled 0"],
        ["AutoDisableLinearThreshold", "dWorldGetAutoDisableLinearThreshold", "dWorldSetAutoDisableLinearThreshold", "number", "Global parameter applied for each world's body - Set and get a body's linear velocity threshold for automatic disabling. The body's linear velocity magnitude must be less than this threshold for it to be considered idle. Set the threshold to dInfinity to prevent the linear velocity from being considered.\nDefault parameter : 0.01"],
        ["AutoDisableAngularThreshold", "dWorldGetAutoDisableAngularThreshold", "dWorldSetAutoDisableAngularThreshold", "number", "Global parameter applied for each world's body - Set and get a body's angular velocity threshold for automatic disabling. The body's linear angular magnitude must be less than this threshold for it to be considered idle. Set the threshold to dInfinity to prevent the angular velocity from being considered.\nDefault parameter : 0.01"],
        ["AutoDisableSteps", "dWorldGetAutoDisableSteps", "dWorldGetAutoDisableSteps", "number", "Global parameter applied for each world's body - Set and get the number of simulation steps that a body must be idle before it is automatically disabled. Set this to zero to disable consideration of the number of steps.\nDefault parameter : 10"],
        ["AutoDisableTime", "dWorldGetAutoDisableTime", "dWorldSetAutoDisableTime", "number", "Global parameter applied for each world's body - Set and get the amount of simulation time that a body must be idle before it is automatically disabled. Set this to zero to disable consideration of the amount of simulation time.\nDefault parameter : 0"],
        ["LinearDamping", "", "", "", ""],
        ["AngularDamping", "", "", "", ""],
        ["LinearDampingThreshold", "", "", "", ""],
        ["AngularDampingThreshold", "", "", "", ""],
        ["MaxAngularSpeed", "", "", "", ""],
        ["ContactSurfaceLayer", "", "", "", ""],
        ["QuickStepNumIterations", "", "", "", ""],
        ["QuickStepW", "", "", "", ""],
    ];

    
}