
import { ChevronDown, Plus } from "lucide-react";

interface Member {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface TeamMembersCardProps {
  members: Member[];
}

export function TeamMembersCard({ members }: TeamMembersCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Team Members</h3>
        <button className="text-sm text-muted-foreground hover:text-foreground">
          Invite your team members to collaborate.
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                {member.avatar || member.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">{member.role}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
