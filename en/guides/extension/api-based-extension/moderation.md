# Sensitive Content Moderation

This module is used to review the content input by end-users and the output content of the LLM within the application. It is divided into two types of extension points.

### Extension Points

* `app.moderation.input` - Extension point for reviewing end-user input content
  * Used to review the variable content passed in by end-users and the input content of conversational applications.
* `app.moderation.output` - Extension point for reviewing LLM output content
  * Used to review the content output by the LLM.
  * When the LLM output is streamed, the content will be segmented into 100-character blocks for API requests to avoid delays in reviewing longer outputs.

### app.moderation.input Extension Point

When **Content Moderation > Review Input Content** is enabled in applications like Chatflow, Agent, or Chat Assistant, Dify will send the following HTTP POST request to the corresponding API extension:

#### Request Body

```
{
    "point": "app.moderation.input", // Extension point type, fixed as app.moderation.input here
    "params": {
        "app_id": string,  // Application ID
        "inputs": {  // Variable values passed in by end-users, key is the variable name, value is the variable value
            "var_1": "value_1",
            "var_2": "value_2",
            ...
        },
        "query": string | null  // Current dialogue input content from the end-user, fixed parameter for conversational applications.
    }
}
```

* Example
  * ```
    {
        "point": "app.moderation.input",
        "params": {
            "app_id": "61248ab4-1125-45be-ae32-0ce91334d021",
            "inputs": {
                "var_1": "I will kill you.",
                "var_2": "I will fuck you."
            },
            "query": "Happy everydays."
        }
    }
    ```

#### API Response Specifications

```
{
    "flagged": bool,  // Whether it violates the moderation rules
    "action": string, // Action to take, direct_output for directly outputting a preset response; overridden for overriding the input variable values
    "preset_response": string,  // Preset response (returned only when action=direct_output)
    "inputs": {  // Variable values passed in by end-users, key is the variable name, value is the variable value (returned only when action=overridden)
        "var_1": "value_1",
        "var_2": "value_2",
        ...
    },
    "query": string | null  // Overridden current dialogue input content from the end-user, fixed parameter for conversational applications. (returned only when action=overridden)
}
```

* Example
  * `action=direct_output`
    * ```
      {
          "flagged": true,
          "action": "direct_output",
          "preset_response": "Your content violates our usage policy."
      }
      ```
  * `action=overridden`
    * ```
      {
          "flagged": true,
          "action": "overridden",
          "inputs": {
              "var_1": "I will *** you.",
              "var_2": "I will *** you."
          },
          "query": "Happy everydays."
      }
      ```

### app.moderation.output Extension Point

When **Content Moderation > Review Output Content** is enabled in applications like Chatflow, Agent, or Chat Assistant, Dify will send the following HTTP POST request to the corresponding API extension:

#### Request Body

```
{
    "point": "app.moderation.output", // Extension point type, fixed as app.moderation.output here
    "params": {
        "app_id": string,  // Application ID
        "text": string  // LLM response content. When the LLM output is streamed, this will be content segmented into 100-character blocks.
    }
}
```

* Example
  * ```
    {
        "point": "app.moderation.output",
        "params": {
            "app_id": "61248ab4-1125-45be-ae32-0ce91334d021",
            "text": "I will kill you."
        }
    }
    ```

#### API Response Specifications

```
{
    "flagged": bool,  // Whether it violates the moderation rules
    "action": string, // Action to take, direct_output for directly outputting a preset response; overridden for overriding the input variable values
    "preset_response": string,  // Preset response (returned only when action=direct_output)
    "text": string  // Overridden LLM response content (returned only when action=overridden)
}
```

* Example
  * `action=direct_output`
    * ```
      {
          "flagged": true,
          "action": "direct_output",
          "preset_response": "Your content violates our usage policy."
      }
      ```
  * `action=overridden`
    * ```
      {
          "flagged": true,
          "action": "overridden",
          "text": "I will *** you."
      }
      ```

## Code Example

Below is an example `src/index.ts` code that can be deployed on Cloudflare. (For the complete usage method of Cloudflare, please refer to [this document](https://docs.dify.ai/guides/extension/api-based-extension/cloudflare-workers))

The code works by performing keyword matching to filter Input (user-entered content) and output (content returned by the large model). Users can modify the matching logic according to their needs.

```
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { generateSchema } from '@anatine/zod-openapi';

type Bindings = {
  TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// API format validation ⬇️
const schema = z.object({
  point: z.union([
    z.literal("ping"),
    z.literal("app.external_data_tool.query"),
    z.literal("app.moderation.input"),
    z.literal("app.moderation.output"),
  ]), // Restricts 'point' to specific values
  params: z
    .object({
      app_id: z.string().optional(),
      tool_variable: z.string().optional(),
      inputs: z.record(z.any()).optional(),
      query: z.any(),
      text: z.any()
    })
    .optional(),
});

// Generate OpenAPI schema
app.get("/", (c) => {
  return c.json(generateSchema(schema));
});

app.post(
  "/",
  (c, next) => {
    const auth = bearerAuth({ token: c.env.TOKEN });
    return auth(c, next);
  },
  zValidator("json", schema),
  async (c) => {
    const { point, params } = c.req.valid("json");
    if (point === "ping") {
      return c.json({
        result: "pong",
      });
    }
    // ⬇️ implement your logic here ⬇️
    // point === "app.external_data_tool.query"
    else if (point === "app.moderation.input"){
    // Input check ⬇️
    const inputkeywords = ["input filter test1", "input filter test2", "input filter test3"];

    if (inputkeywords.some(keyword => params.query.includes(keyword))) 
      {
      return c.json({
        "flagged": true,
        "action": "direct_output",
        "preset_response": "Input contains prohibited content, please try a different question!"
      });
    } else {
      return c.json({
        "flagged": false,
        "action": "direct_output",
        "preset_response": "Input is normal"
      });
    }
    // Input check completed 
    }
    
    else {
      // Output check ⬇️
      const outputkeywords = ["output filter test1", "output filter test2", "output filter test3"]; 

  if (outputkeywords.some(keyword => params.text.includes(keyword))) 
    {
      return c.json({
        "flagged": true,
        "action": "direct_output",
        "preset_response": "Output contains sensitive content and has been filtered by the system. Please ask a different question!"
      });
    }
  
  else {
    return c.json({
      "flagged": false,
      "action": "direct_output",
      "preset_response": "Output is normal"
    });
  };
    }
    // Output check completed 
  }
);

export default app;
```