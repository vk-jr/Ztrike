import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username cannot exceed 20 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  sport: z.string().min(1, "Please select a sport"),
  position: z.string().optional(),
  team: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export default function CreateAccount() {
  const [step, setStep] = useState(1);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      sport: "",
      position: "",
      team: "",
      bio: "",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=100&h=100",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/users", userData);
    },
    onSuccess: () => {
      toast({
        title: "Account created!",
        description: "Welcome to SportConnect! Your account has been created successfully.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating account:", error);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      createUserMutation.mutate(data);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const sportOptions = [
    "Basketball",
    "Football",
    "Soccer",
    "Tennis",
    "Golf",
    "Baseball",
    "Hockey",
    "Rugby",
    "Cricket",
    "Swimming",
    "Athletics",
    "Volleyball",
    "Other",
  ];

  const getPositionOptions = (sport: string) => {
    switch (sport) {
      case "Basketball":
        return ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"];
      case "Football":
        return ["Quarterback", "Running Back", "Wide Receiver", "Tight End", "Offensive Line", "Defensive Line", "Linebacker", "Cornerback", "Safety", "Special Teams"];
      case "Soccer":
        return ["Goalkeeper", "Defender", "Midfielder", "Forward", "Winger", "Striker"];
      case "Tennis":
        return ["Singles Player", "Doubles Player"];
      default:
        return [];
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
              <CardDescription>
                Join SportConnect and connect with other athletes
              </CardDescription>
            </div>
            <div className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
              Step {step} of 3
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sports Profile</h3>
                  
                  <FormField
                    control={form.control}
                    name="sport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Sport</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sportOptions.map((sport) => (
                              <SelectItem key={sport} value={sport}>
                                {sport}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || ""}
                          disabled={!form.watch("sport")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getPositionOptions(form.watch("sport")).map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team / Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="Team or organization name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself, your sports career, achievements, etc." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <div className="flex items-center space-x-4">
                          <img 
                            src={field.value || "https://via.placeholder.com/100"} 
                            alt="Profile preview" 
                            className="h-16 w-16 rounded-full object-cover border border-neutral-200"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-neutral-500 mb-2">
                              Enter a URL for your profile picture (in a real app, this would be a file upload)
                            </p>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={createUserMutation.isPending}
                >
                  {step < 3 ? 'Continue' : createUserMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-neutral-500">
              Already have an account? <a href="#" className="text-primary font-medium">Log in</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
