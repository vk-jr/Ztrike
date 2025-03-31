import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ConnectionCard from "@/components/ConnectionCard";
import { UserPlus, Check, X, Search, Users, Link2 } from "lucide-react";

export default function Network() {
  const [searchQuery, setSearchQuery] = useState("");
  const userId = 1; // Mock user ID - in a real app, this would come from authentication

  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: [`/api/users/${userId}/connections`],
  });

  const { data: pendingConnections, isLoading: isLoadingPending } = useQuery({
    queryKey: [`/api/connections/pending?userId=${userId}`],
  });

  const { data: suggestedConnections, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: [`/api/connections/suggestions?userId=${userId}`],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">My Network</CardTitle>
              <CardDescription className="text-neutral-400">
                Connect with other athletes, coaches, and sports professionals
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search connections..."
                className="pl-10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connections and Pending Requests */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="connections" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="connections" className="flex-1">
                <Users className="h-4 w-4 mr-2" /> My Connections
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" /> Pending Requests 
                {pendingConnections && pendingConnections.length > 0 && (
                  <span className="ml-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                    {pendingConnections.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Link2 className="h-5 w-5 mr-2 text-primary" /> Your Connections
                  </CardTitle>
                  <CardDescription>
                    Manage your professional network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingConnections ? (
                    Array(3).fill(0).map((_, index) => (
                      <div key={index} className="py-3 border-b border-neutral-200 last:border-0">
                        <div className="flex items-center">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="ml-3 flex-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48 mt-1" />
                          </div>
                          <Skeleton className="h-9 w-24 rounded-md" />
                        </div>
                      </div>
                    ))
                  ) : connections && connections.length > 0 ? (
                    connections.map((connection: any) => (
                      <div key={connection.id} className="py-3 border-b border-neutral-200 last:border-0">
                        <div className="flex items-center">
                          <img 
                            src={connection.user.avatar} 
                            alt={connection.user.fullName} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium">{connection.user.fullName}</h4>
                            <p className="text-sm text-neutral-400">
                              {connection.user.sport} • {connection.user.team}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Users className="h-4 w-4 mr-2" /> Connected
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center">
                      <Users className="h-12 w-12 mx-auto text-neutral-300" />
                      <h3 className="mt-2 font-medium">No connections yet</h3>
                      <p className="text-sm text-neutral-400 mt-1">
                        Start building your network by connecting with other athletes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <UserPlus className="h-5 w-5 mr-2 text-primary" /> Pending Requests
                  </CardTitle>
                  <CardDescription>
                    People who want to connect with you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPending ? (
                    Array(2).fill(0).map((_, index) => (
                      <div key={index} className="py-3 border-b border-neutral-200 last:border-0">
                        <div className="flex items-center">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="ml-3 flex-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48 mt-1" />
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="h-9 w-9 rounded-md" />
                            <Skeleton className="h-9 w-9 rounded-md" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : pendingConnections && pendingConnections.length > 0 ? (
                    pendingConnections.map((connection: any) => (
                      <div key={connection.id} className="py-3 border-b border-neutral-200 last:border-0">
                        <div className="flex items-center">
                          <img 
                            src={connection.user.avatar} 
                            alt={connection.user.fullName} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium">{connection.user.fullName}</h4>
                            <p className="text-sm text-neutral-400">
                              {connection.user.sport} • {connection.user.team}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="icon" variant="outline" className="text-green-500 border-green-500 hover:bg-green-50">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center">
                      <UserPlus className="h-12 w-12 mx-auto text-neutral-300" />
                      <h3 className="mt-2 font-medium">No pending requests</h3>
                      <p className="text-sm text-neutral-400 mt-1">
                        When someone sends you a connection request, it will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* People You May Know */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-primary" /> People You May Know
              </CardTitle>
              <CardDescription>
                Connect with athletes in your sport
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingSuggestions ? (
                Array(5).fill(0).map((_, index) => (
                  <div key={index} className="p-0">
                    <ConnectionCard connection={null} currentUserId={userId} />
                  </div>
                ))
              ) : suggestedConnections && suggestedConnections.length > 0 ? (
                suggestedConnections.map((connection: any) => (
                  <ConnectionCard 
                    key={connection.id} 
                    connection={connection} 
                    currentUserId={userId} 
                  />
                ))
              ) : (
                <div className="py-6 text-center">
                  <Users className="h-12 w-12 mx-auto text-neutral-300" />
                  <h3 className="mt-2 font-medium">No suggestions available</h3>
                  <p className="text-sm text-neutral-400 mt-1 px-4">
                    We'll suggest more connections as you build your profile
                  </p>
                </div>
              )}

              <div className="p-3 bg-neutral-50 text-center">
                <Button variant="link" className="text-primary text-sm font-medium">
                  View More Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
