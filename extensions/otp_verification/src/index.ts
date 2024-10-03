import { defineEndpoint } from "@directus/extensions-sdk";

export default defineEndpoint((router, context) => {
  const { services, getSchema } = context;
  const { UsersService, MailService } = services;

  const usersService = new UsersService({ schema: getSchema });
  const mailService = new MailService({ schema: getSchema });

  router.post("/", async (_req, res) => {
    const { email, code } = _req.body;

    // Check if request body contains data
    if (!email || !code) {
      return res.status(400).send({
        errors: [
          {
            message: "Payload email and code are required",
            extensions: {
              code: "BAD_REQUEST",
            },
          },
        ],
      });
    }

    try {
      // Check if the user already exists
      const existingUser = await usersService.readByQuery({
        filter: {
          email: { _eq: email },
        },
      });

      if (existingUser && existingUser.length > 0) {
        return res.status(409).send({
          errors: [
            {
              message: "Email already exists",
              extensions: {
                code: "CONFLICT",
              },
            },
          ],
        });
      }

      // Send email
      await mailService.send({
        to: `${email}`,
        subject: "WANESNI EMAIL VERIFICATION",
        template: {
          name: "otp-email-template",
          data: {
            code: `${code}`,
          },
        },
      });

      return res.status(200).send({
        data: [
          {
            message: `Email sent to ${email}`,
            extensions: {
              code: "SUCCESS",
            },
          },
        ],
      });
    } catch (error) {
      // Handle any unexpected errors
      return res.status(500).send({
        errors: [
          {
            message: error.message || "An unexpected error occurred",
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          },
        ],
      });
    }
  });
});

