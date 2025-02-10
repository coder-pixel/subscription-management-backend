import { Router } from "express";

const subscriptionRouter = Router();

// get all subscriptions
subscriptionRouter.get("/", (req, res) => {});

// get a subscription by id
subscriptionRouter.get("/:id", (req, res) => {});

// create a subscriptrion
subscriptionRouter.post("/", (req, res) => {});

// update a subscriptrion
subscriptionRouter.put("/:id", (req, res) => {});

// delete a subscriptrion
subscriptionRouter.delete("/:id", (req, res) => {});

// get all user subscriptrion
subscriptionRouter.get("/:user/:id", (req, res) => {});

// cancel a user subscriptrion
subscriptionRouter.put("/:id/cancel", (req, res) => {});

// all upcoming renewals
subscriptionRouter.get("/upcoming-renewals", (req, res) => {});

export default subscriptionRouter;
