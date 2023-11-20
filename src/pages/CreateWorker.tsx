import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "name must not be null" })
    .max(100, { message: "name have 100 characters at most" }),
  delay0: z.number().min(10),
  delay1: z.number().min(15),
  authorization: z
    .string()
    .min(1, { message: "authorization must not be null" }),
  cookie: z.string().min(1, { message: "cookie must not be null" }),
  userAgent: z.string(),
  endpoint: z.string(),
  proxy: z.string(),
  userId: z.string().min(1, { message: "userId must not be null" }),
  deptIds: z.string().min(1, { message: "deptIds must not be null" }),
});
function CreateWorker() {
  const { appendWorker } = useStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      delay0: 10,
      delay1: 15,
      authorization: "",
      cookie: "",
      userAgent: "",
      endpoint: "",
      proxy: "",
      userId: "",
      deptIds: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const payload = {
      name: data.name,
      delaySecondsRange: [data.delay0, data.delay1],
      credentials: {
        authorization: data.authorization,
        cookie: data.cookie,
        userAgent: data.userAgent || null,
      },
      endpoint: data.endpoint || null,
      proxy: data.proxy || null,
      userId: data.userId,
      deptIds: data.deptIds,
    };

    axios
      .post("http://localhost:3000/workers", payload)
      .then(({ data: { data, code, msg } }) => {
        if (code === 200) {
          appendWorker(data);
          navigate("/");
        } else {
          alert(`Error: ${msg} when create work`);
        }
      });
  };
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="w-[50rem] mx-auto">
          <Form {...form}>
            <form
              className="w-full space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Worker Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field}></Input>
                    </FormControl>
                    <FormDescription>
                      This is the worker name, must be distinct
                    </FormDescription>
                    <FormMessage className="text-xs ml-2"></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              <div className="flex">
                <FormField
                  control={form.control}
                  name="delay0"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Delay Range 0</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="delay range start(secs)"
                          {...field}
                          {...form.register("delay0", {
                            valueAsNumber: true,
                          })}
                        ></Input>
                      </FormControl>
                      <FormDescription>
                        Worker's random delay range0
                      </FormDescription>
                      <FormMessage className="text-xs ml-2"></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="delay1"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Delay Range 1</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="delay range end(secs)"
                          {...field}
                          {...form.register("delay1", {
                            valueAsNumber: true,
                          })}
                        ></Input>
                      </FormControl>
                      <FormDescription>
                        Worker's random delay range1
                      </FormDescription>
                      <FormMessage className="text-xs ml-2"></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <FormField
                control={form.control}
                name="authorization"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Authorization</FormLabel>
                    <FormControl>
                      <Input placeholder="authoriation" {...field}></Input>
                    </FormControl>
                    <FormDescription>
                      This is the jwt token, must be a valide token
                    </FormDescription>
                    <FormMessage className="text-xs ml-2"></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="cookie"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Cookie</FormLabel>
                    <FormControl>
                      <Input placeholder="cookie" {...field}></Input>
                    </FormControl>
                    <FormDescription>verified cookie</FormDescription>
                    <FormMessage className="text-xs ml-2"></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="userAgent"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>User Agent</FormLabel>
                    <FormControl>
                      <Input placeholder="user agent" {...field}></Input>
                    </FormControl>
                    <FormDescription>An option user-agent</FormDescription>
                    <FormMessage className="text-xs ml-2"></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input placeholder="url" {...field}></Input>
                    </FormControl>
                    <FormDescription>An option endpoint url</FormDescription>
                    <FormMessage className="text-xs ml-2"></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="proxy"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Proxy</FormLabel>
                    <FormControl>
                      <Input placeholder="proxy" {...field}></Input>
                    </FormControl>
                    <FormDescription>The proxy for this work</FormDescription>
                    <FormMessage className="text-xs ml-2"></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="user id" {...field}></Input>
                    </FormControl>
                    <FormDescription>query string: userId</FormDescription>
                    <FormMessage className="text-xs ml-2"></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="deptIds"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Dept IDs</FormLabel>
                    <FormControl>
                      <Input placeholder="deptIds" {...field}></Input>
                    </FormControl>
                    <FormDescription>Query string: deptIds</FormDescription>
                    <FormMessage className="text-xs ml-2"></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit">Create Worker</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateWorker;
