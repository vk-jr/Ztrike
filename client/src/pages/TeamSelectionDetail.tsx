import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  FileText, 
  ClipboardList, 
  Timer, 
  Users
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function TeamSelectionDetail() {
  // Get the selection process ID from URL params
  const params = useParams<{ id: string }>();
  const selectionId = parseInt(params.id);

  // Fetch selection process data
  const { data: selection, isLoading } = useQuery({
    queryKey: [`/api/teams/selections/${selectionId}`],
    queryFn: async () => {
      // Mock data for demonstration
      return {
        id: selectionId,
        teamId: selectionId + 2,
        teamName: selectionId === 1 ? "Los Angeles Lakers" : "New England Patriots",
        teamLogo: selectionId === 1 
          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/1200px-Los_Angeles_Lakers_logo.svg.png" 
          : "https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg",
        sport: selectionId === 1 ? "Basketball" : "American Football",
        league: selectionId === 1 ? "NBA" : "NFL",
        status: selectionId === 1 ? "In Progress" : "Applied",
        startDate: selectionId === 1 ? "2025-03-15" : "2025-04-01",
        endDate: selectionId === 1 ? "2025-04-15" : "2025-05-15",
        stage: selectionId === 1 ? "Physical Assessment" : "Application Review",
        nextStage: selectionId === 1 ? "Skills Evaluation" : "Physical Assessment",
        nextStageDate: selectionId === 1 ? "2025-03-31" : "2025-04-10",
        progressPercentage: selectionId === 1 ? 40 : 10,
        contactEmail: selectionId === 1 ? "recruitment@lakers.com" : "recruitment@patriots.com",
        contactPhone: selectionId === 1 ? "+1 (213) 555-1234" : "+1 (508) 555-6789",
        description: selectionId === 1 
          ? "The Los Angeles Lakers are conducting tryouts for the upcoming season. This selection process is designed to identify talented basketball players to join our roster."
          : "The New England Patriots are holding open trials for potential players. This rigorous selection process aims to find the best talent to strengthen our team.",
        requirements: [
          "Age: 18-35 years old",
          "Previous experience at collegiate or professional level",
          "Excellent physical condition",
          "Strong teamwork skills",
          "Valid ID and medical clearance"
        ],
        timeline: [
          {
            stage: "Application Submission",
            status: "Completed",
            date: selectionId === 1 ? "2025-03-10" : "2025-03-25",
            description: "Initial application submitted and received"
          },
          {
            stage: "Application Review",
            status: selectionId === 1 ? "Completed" : "In Progress",
            date: selectionId === 1 ? "2025-03-15" : "2025-04-01",
            description: "Review of credentials, experience, and achievements"
          },
          {
            stage: "Physical Assessment",
            status: selectionId === 1 ? "In Progress" : "Upcoming",
            date: selectionId === 1 ? "2025-03-25" : "2025-04-10",
            description: "Evaluation of physical fitness, strength, and conditioning"
          },
          {
            stage: "Skills Evaluation",
            status: "Upcoming",
            date: selectionId === 1 ? "2025-03-31" : "2025-04-20",
            description: "Assessment of sport-specific skills and techniques"
          },
          {
            stage: "Team Practice",
            status: "Upcoming",
            date: selectionId === 1 ? "2025-04-07" : "2025-05-01",
            description: "Practice sessions with current team members"
          },
          {
            stage: "Final Decision",
            status: "Upcoming",
            date: selectionId === 1 ? "2025-04-15" : "2025-05-15",
            description: "Final selection decision"
          }
        ]
      };
    },
    enabled: !isNaN(selectionId)
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="animate-pulse h-8 w-40 bg-neutral-200 rounded mb-4"></div>
        <div className="animate-pulse h-64 bg-neutral-200 rounded-lg mb-8"></div>
      </div>
    );
  }

  if (!selection) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="flex justify-start mb-8">
          <Button variant="outline" asChild>
            <Link href="/teams">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
            </Link>
          </Button>
        </div>
        
        <Card className="py-12">
          <CardContent className="text-center">
            <ClipboardList className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Selection Process Not Found</h2>
            <p className="text-neutral-500 max-w-md mx-auto mb-6">
              We couldn't find the selection process you're looking for. It may have been completed or doesn't exist.
            </p>
            <Button asChild>
              <Link href="/teams">View Team Selection Processes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine the current stage index
  const currentStageIndex = selection.timeline.findIndex(t => t.status === "In Progress");
  
  return (
    <div className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
      <div className="flex justify-start mb-8">
        <Button variant="outline" asChild>
          <Link href="/teams">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
          </Link>
        </Button>
      </div>
      
      {/* Team Selection Overview */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 lg:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white rounded-lg p-2 shadow-sm">
              <img 
                src={selection.teamLogo} 
                alt={selection.teamName} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{selection.teamName}</h1>
                <Badge className="md:self-start">{selection.league}</Badge>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-neutral-600 mb-4">
                <div className="flex items-center">
                  <Badge variant={
                    selection.status === "In Progress" ? "default" : 
                    selection.status === "Applied" ? "outline" :
                    selection.status === "Accepted" ? "default" : "destructive"
                  }>
                    {selection.status}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-neutral-500" />
                  <span>
                    {new Date(selection.startDate).toLocaleDateString()} - {new Date(selection.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-neutral-600 max-w-3xl">{selection.description}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-500 mb-2">Selection Progress</h3>
            <Progress value={selection.progressPercentage} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Application</span>
              <span>Assessment</span>
              <span>Practice</span>
              <span>Decision</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Sport</h3>
              <p className="font-medium">{selection.sport}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Current Stage</h3>
              <p className="font-medium text-primary">{selection.stage}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Next Stage</h3>
              <p className="font-medium">{selection.nextStage}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Next Date</h3>
              <p className="font-medium">{new Date(selection.nextStageDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Requirements Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-primary" /> Requirements
            </CardTitle>
            <CardDescription>Eligibility criteria for selection</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {selection.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3 className="font-medium">Contact Information</h3>
              <div className="text-sm space-y-2">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <a href={`mailto:${selection.contactEmail}`} className="text-primary hover:underline">
                    {selection.contactEmail}
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Phone:</span>
                  <a href={`tel:${selection.contactPhone}`} className="text-primary hover:underline">
                    {selection.contactPhone}
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Timeline Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" /> Selection Timeline
            </CardTitle>
            <CardDescription>Process stages and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-3.5 top-1 h-full w-0.5 bg-neutral-200"></div>
              
              <div className="space-y-8 relative">
                {selection.timeline.map((stage, index) => {
                  const isCompleted = stage.status === "Completed";
                  const isInProgress = stage.status === "In Progress";
                  const isUpcoming = stage.status === "Upcoming";
                  
                  return (
                    <div key={index} className="relative pl-12">
                      {/* Stage indicator */}
                      <div className={`absolute left-0 top-0 rounded-full h-7 w-7 flex items-center justify-center z-10 
                        ${isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : isInProgress 
                            ? 'bg-primary text-white' 
                            : 'bg-neutral-100 text-neutral-400'}`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : isInProgress ? (
                          <Timer className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className={`p-4 rounded-lg ${isInProgress ? 'bg-primary/5 border border-primary/10' : 'bg-neutral-50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium ${isInProgress ? 'text-primary' : ''}`}>
                            {stage.stage}
                          </h3>
                          <Badge variant={
                            isCompleted ? "default" : 
                            isInProgress ? "default" : 
                            "outline"
                          } className={isCompleted ? "bg-green-100 text-green-700 border-green-200" : ""}>
                            {stage.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-500 mb-2">
                          {new Date(stage.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm">{stage.description}</p>
                        
                        {isInProgress && (
                          <div className="mt-3 bg-white p-3 rounded border border-primary/20">
                            <div className="flex items-start">
                              <AlertCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                              <div className="text-sm">
                                <p className="font-medium">Current Stage</p>
                                <p className="text-neutral-500">
                                  This stage is in progress. The next stage ({selection.nextStage}) 
                                  is scheduled for {new Date(selection.nextStageDate).toLocaleDateString()}.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}