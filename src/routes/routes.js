const { Router } = require("express");
const { PrismaClient } = require('@prisma/client');
const {generateRandomGadgetName, getRandomInt, isNumeric} = require('../utils/utils');
const {authenticateUser} = require("../middlewares/middlewares");

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /gadgets
 * Retrieves all gadgets or filters by status
 * @name getGadgets
 * @function
 * @param {string} [query.status] - Optional status filter (Available, Deployed, Destroyed, Decommissioned)
 * @returns {Object} Response containing list of gadgets
 * @returns {boolean} success - Indicates if the request was successful
 * @returns {Array} data - List of gadgets with their details
 */
router.get('/gadgets', authenticateUser, async (req, res) => {
    try {
        const status = req.query.status;
        let gadgets;
        if (status != null) {
            if (!(status == "Available" || status == "Deployed" || status == "Destroyed" || status == "Decommissioned")) {
                res.status(400).json({success: false, message: "Status parameter is an enum(Available, Deployed, Destroyed, Decommissioned)"});
                return
            }
            gadgets = await prisma.gadget.findMany({
                where: {
                    status: status
                }
            });
        } else {
            gadgets = await prisma.gadget.findMany();
        }
        responseObjects = []
        gadgets.forEach(gadget => {
            let name = gadget.name
            let success = gadget.success
            let status = gadget.status
            responseObjects.push({"id": gadget.id,"gadget": `${name} ${success}% success probability. Status ${status}`})
        });
        res.json({"success": true, "data": responseObjects})
    } catch (err) {
        console.log(err)
        res.status(500).json({"success": false, "error": err})
    }
})

/**
 * POST /gadgets
 * Creates a new gadget with random name and success probability
 * @name createGadget
 * @function
 * @returns {Object} Response containing the created gadget
 * @returns {boolean} success - Indicates if the request was successful
 * @returns {Object} message - The created gadget object
 */
router.post('/gadgets', authenticateUser, async (req, res) => {
    try {
        let randomName = generateRandomGadgetName()
        let success = getRandomInt()
        let gadget = await prisma.gadget.create({
            data: {
                name: randomName,
                success: success,
                status: "Available"
            }
        });
        res.status(201).json({success: true, message: gadget})
    } catch (err) {
        console.log("erroe")
        console.log(err);
        res.status(500).json({success: false, message: err});
    }
})

/**
 * PATCH /gadgets
 * Updates an existing gadget's status or success probability
 * @name updateGadget
 * @function
 * @param {Object} body - Request body
 * @param {string} body.name - Name of the gadget to update
 * @param {string} [body.status] - New status (Available, Deployed, Destroyed, Decommissioned)
 * @param {number} [body.success] - New success probability (0-100)
 * @returns {Object} Response containing the updated gadget
 * @returns {boolean} success - Indicates if the request was successful
 * @returns {Object} message - The updated gadget object
 */
router.patch('/gadgets', authenticateUser, async (req, res) => {
    try {
        const {name, status, success} = req.body
        console.log(name, status, success);
        if (name == null) {
            res.status(422).json({success: false, message: "name field is required"});
            return
        }
        if (typeof success === 'undefined' && typeof status === 'undefined') {
            res.status(400).json({success: false, message: "either success or status must be defined"});
            return
        }

        if (typeof status !== 'undefined') {
            if (!(status == "Available" || status == "Deployed" || status == "Destroyed" || status == "Decommissioned")) {
                res.status(400).json({success: false, message: "Status is an enum(Available, Deployed, Destroyed, Decommissioned)"});
                return
            }
        }
        if (typeof success !== 'undefined') {
            if (!(isNumeric(success))) {
                res.status(400).json({success: false, message: "success must be a number between 0-100"})
                return
            }
        }
        
        let data
        if (status != null) {
            data = {
                status: status
            }
        }
        if (success != null) {
            data = {
                success: parseInt(success)
            }
        }
        if (success != null && status != null) {
            data = {
                success: parseInt(success),
                status: status
            }
        }

        const update = await prisma.gadget.update({
            where: {
                name: name
            },
            data: data
        });
        res.status(201).json({success: true, message: update})
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false, message: err});
    }
});

/**
 * DELETE /gadgets
 * Decommissions a gadget by setting its status to Decommissioned
 * @name deleteGadget
 * @function
 * @param {Object} body - Request body
 * @param {string} body.name - Name of the gadget to decommission
 * @returns {Object} Response containing the decommissioned gadget
 * @returns {boolean} success - Indicates if the request was successful
 * @returns {Object} message - The decommissioned gadget object
 */
router.delete("/gadgets", authenticateUser, async (req, res) => {
    try {
        const {name} = req.body;
        if (name == null) {
            res.status(400).json({success: false, message: "name required in request body"});
            return
        }
        let update = await prisma.gadget.update({
            where: {
                name: name
            },
            data: {
                status: "Decommissioned",
                timestamp: new Date()
            }
        });
        res.status(201).json({success: true, message: update});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false, message: err});
    }
});

/**
 * POST /gadgets/:id/self-destruct
 * Triggers self-destruction of a gadget by ID
 * @name selfDestructGadget
 * @function
 * @param {string} id - The ID of the gadget to self-destruct
 * @param {Object} body - Request body
 * @param {string} body.confirmationCode - Confirmation code required for self-destruction
 * @returns {Object} Response containing the destroyed gadget
 * @returns {boolean} success - Indicates if the request was successful
 * @returns {Object} message - The destroyed gadget object
 */
router.post("/gadgets/:id/self-destruct", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const {confirmationCode} = req.body;
        if (confirmationCode == null) {
            res.status(400).json({success: false, message: "confirmationCode field is mandatory"});
            return
        }
        let update = await prisma.gadget.update({
            where: {
                id: id
            },
            data: {
                status: "Destroyed",
                timestamp: new Date()
            }
        });
        res.status(201).json({success: true, message: update});

    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: err});
    }
})

module.exports = router;