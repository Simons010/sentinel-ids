import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Shield,
  AlertTriangle,
  Eye,
  Info,
  Clock,
  MapPin,
  Server,
  Cpu,
  Activity,
  ChevronRight,
} from "lucide-react";

const SEVERITY_COLORS = {
  critical: "bg-red-500/20 text-red-400 border-red-500/50",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  low: "bg-green-500/20 text-green-400 border-green-500/50",
  informational: "bg-blue-500/20 text-blue-400 border-blue-500/50",
};

export function EventDetailsDialog({ event, open, onOpenChange }) {
  if (!event) return null;

  const severityColor =
    SEVERITY_COLORS[event.severity] || SEVERITY_COLORS.informational;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#1E293B] border-[#334155]  text-white">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className={`uppercase font-bold ${severityColor}`}>
              {event.severity || "Unknown"} Severity
            </Badge>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(event.timestamp).toLocaleString()}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {event.attack_type || "Security Event"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            Detailed analysis of the detected network activity.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="bg-[#1E293B]/50 p-4 rounded-lg border border-[#334155]">
            <p className="text-sm text-gray-200 leading-relaxed">
              {event.text ||
                event.message ||
                "No additional description available for this event."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Source:</span>
                <span className="font-mono text-cyan-400">
                  {event.src_ip || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Target:</span>
                <span className="font-mono text-emerald-400">
                  {event.dst_ip || "N/A"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Server className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Host:</span>
                <span className="text-gray-200">{event.host || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Process:</span>
                <span className="text-gray-200">
                  {event.process || "N/A"} (PID: {event.pid || "?"})
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#334155]">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Confidence Score</span>
              <span>{(event.confidence * 100).toFixed(2)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#22D3EE] rounded-full"
                style={{ width: `${event.confidence * 100}%` }}
              />
            </div>
          </div>

          {event.raw_log && (
            <div className="pt-2 border-t border-[#334155]">
              <span className="text-xs text-gray-500 block mb-2">
                Raw Log Data
              </span>
              <div className="bg-[#0F172A] p-3 rounded border border-[#334155] max-h-40 overflow-y-auto">
                <code className="text-[10px] text-cyan-400 font-mono break-all whitespace-pre-wrap">
                  {event.raw_log}
                </code>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start gap-2 flex lg:justify-between">
          <Button
            variant="outline"
            className="border-[#334155] bg-gray-400 hover:bg-gray-600 hover:text-zinc-300"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white flex items-center gap-2">
            Investigate Further
            <ChevronRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Target(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
