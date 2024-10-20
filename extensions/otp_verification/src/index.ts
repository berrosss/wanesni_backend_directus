import { defineEndpoint } from "@directus/extensions-sdk";

export default defineEndpoint((router, context) => {
  router.post("/", async (_req: any, res: any) => {
      const { services, getSchema } = context;
      const { UsersService, MailService } = services;
      const schema = await getSchema();
      const usersService = new UsersService({
        schema,
        accountability: {
          ..._req.accountability,
          admin: true,
          role: "364b72a5-6d56-4039-aaa2-a5b5ac255784",
        },
      });
      const mailService = new MailService({ schema });

      const { email, code } = _req.body;

      if (!email || !code) {
        return res.status(400).send({
          errors: [
            {
              message: "Payload email and code are required 5",
              extensions: {
                code: "BAD_REQUEST",
              },
            },
          ],
        });
      }

      try {
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
      } catch (error: any) {
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