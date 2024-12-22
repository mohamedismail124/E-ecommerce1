export const validation = (Schema) => {
  return (req, res, next) => {
    let inputs = { ...req.body, ...req.params, ...req.query };
    let { error } = Schema.validate(inputs, { abortEarly: false });
    if (error) {
      let errors = error.details.map((detail) => detail.message);
      res.json(errors);
    } else {
      next();
    }
  };
};
