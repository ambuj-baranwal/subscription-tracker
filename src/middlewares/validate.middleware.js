
const validate = (schema ) => (req, res, next) => {
    try {
        const dataToValidate = {
            body: req.body,
            query: req.query,
            params: req.params,
        }

        const parsedRequest = schema.safeParse(dataToValidate);
        if (parsedRequest.success) {
            req.body = parsedRequest.data.body;
            // req.query = parsedRequest.data.query;
            req.params = parsedRequest.data.params;

            return next();
        } else {
            // console.log(parsedRequest.error.flatten().fieldErrors)
            console.log(parsedRequest.error.issues[0].message);
            return res.status(400).send({
                message: "Validation Failed",
                error: parsedRequest.error.issues[0].message,
            });
        }
    } catch (error) {
        // Handling other unexpected errors
        console.error("Unhandled error in validation middleware ", error);
        return res.status(500).json({
            message: "Validation Failed",
            error: error.message,
        });
    }
}

export {
    validate,
}