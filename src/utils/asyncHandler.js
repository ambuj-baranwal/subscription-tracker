// try ... catch method

const asyncHandler = ( requestHandler ) => {
    return async (req, res, next ) => {
        try {
            await requestHandler(req, res, next)
        } catch (error) {
            console.log("AsyncHandler Error : ", error)
            next(error)
        }
    }
}


// Promise based Async Handler

// const asyncHandler = ( requestHandler ) => {
//     return (req, res, next ) => {
//         Promise
//             .resolve(requestHandler(req, res, next))
//             .catch((err) => next(err));
//     }
// }

export { asyncHandler };