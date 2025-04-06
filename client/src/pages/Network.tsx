import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ConnectionCard from "@/components/ConnectionCard";
import { UserPlus, Check, X, Search, Users, Link2 } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/App";

export default function Network() {
  // Get user ID from AuthContext instead of hardcoded value
  const { user: currentUser } = useContext(AuthContext);
  const userId = currentUser?.id || 0;
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md mb-8 border border-neutral-100">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">My Network</CardTitle>
              <CardDescription className="text-neutral-500 mt-2 text-lg">
                Connect with other athletes, coaches, and sports professionals
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
              <Input
                placeholder="Search connections..."
                className="pl-11 w-full bg-neutral-50 border-neutral-200 focus:border-primary/50 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </div>

      <div className="space-y-6">
        <div className="space-y-6">
          <Tabs defaultValue="connections" className="w-full">
            <TabsList className="w-full mb-6 bg-neutral-50 p-1 border border-neutral-200">
              <TabsTrigger value="connections" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Users className="h-5 w-5 mr-2" /> My Connections
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <UserPlus className="h-5 w-5 mr-2" /> Pending Requests 
                {pendingConnections && pendingConnections.length > 0 && (
                  <span className="ml-2 bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-sm font-medium">
                    {pendingConnections.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections" className="space-y-6">
              <Card className="border border-neutral-200">
                <CardHeader className="border-b border-neutral-100 bg-neutral-50/50">
                  <CardTitle className="text-xl flex items-center text-primary">
                    <Link2 className="h-6 w-6 mr-2" /> Your Connections
                  </CardTitle>
                  <CardDescription className="text-neutral-500">
                    Manage your professional network
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoadingConnections ? (
                    Array(3).fill(0).map((_, index) => (
                      <div key={index} className="py-4 border-b border-neutral-100 last:border-0">
                        <div className="flex items-center">
                          <Skeleton className="h-14 w-14 rounded-full" />
                          <div className="ml-4 flex-1">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-4 w-52 mt-2" />
                          </div>
                          <Skeleton className="h-10 w-28 rounded-md" />
                        </div>
                      </div>
                    ))
                  ) : connections && connections.length > 0 ? (
                    connections.map((connection: any) => (
                      <div key={connection.id} className="py-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors">
                        <div className="flex items-center">
                          <img 
                            src={connection.user.avatar} 
                            alt={connection.user.fullName} 
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-neutral-100"
                          />
                          <div className="ml-4 flex-1">
                            <h4 className="font-semibold text-lg">{connection.user.fullName}</h4>
                            <p className="text-neutral-500 mt-1">
                              {connection.user.sport} • {connection.user.team}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="flex items-center hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                            <Users className="h-4 w-4 mr-2" /> Connected
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <Users className="h-16 w-16 mx-auto text-neutral-300" />
                      <h3 className="mt-4 text-lg font-medium">No connections yet</h3>
                      <p className="text-neutral-500 mt-2">
                        Start building your network by connecting with other athletes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-6">
              <Card className="border border-neutral-200">
                <CardHeader className="border-b border-neutral-100 bg-neutral-50/50">
                  <CardTitle className="text-xl flex items-center text-primary">
                    <UserPlus className="h-6 w-6 mr-2" /> Pending Requests
                  </CardTitle>
                  <CardDescription className="text-neutral-500">
                    People who want to connect with you
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoadingPending ? (
                    Array(2).fill(0).map((_, index) => (
                      <div key={index} className="py-4 border-b border-neutral-100 last:border-0">
                        <div className="flex items-center">
                          <Skeleton className="h-14 w-14 rounded-full" />
                          <div className="ml-4 flex-1">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-4 w-52 mt-2" />
                          </div>
                          <div className="flex space-x-3">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <Skeleton className="h-10 w-10 rounded-md" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : pendingConnections && pendingConnections.length > 0 ? (
                    pendingConnections.map((connection: any) => (
                      <div key={connection.id} className="py-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors">
                        <div className="flex items-center">
                          <img 
                            src={connection.user.avatar} 
                            alt={connection.user.fullName} 
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-neutral-100"
                          />
                          <div className="ml-4 flex-1">
                            <h4 className="font-semibold text-lg">{connection.user.fullName}</h4>
                            <p className="text-neutral-500 mt-1">
                              {connection.user.sport} • {connection.user.team}
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <Button size="icon" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 h-10 w-10">
                              <Check className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 h-10 w-10">
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <UserPlus className="h-16 w-16 mx-auto text-neutral-300" />
                      <h3 className="mt-4 text-lg font-medium">No pending requests</h3>
                      <p className="text-neutral-500 mt-2">
                        When someone sends you a connection request, it will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* People You May Know section moved below connections */}
          <Card className="border border-neutral-200 mt-8">
            <CardHeader className="border-b border-neutral-100 bg-neutral-50/50">
              <CardTitle className="text-xl flex items-center text-primary">
                <UserPlus className="h-6 w-6 mr-2" /> People You May Know
              </CardTitle>
              <CardDescription className="text-neutral-500">
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
