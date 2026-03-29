import re

SYSLOG_PATTERN = re.compile(
    r'(?P<month>\w+)\s+'
    r'(?P<day>\d+)\s+'
    r'(?P<time>\d+:\d+:\d+)\s+'
    r'(?P<host>\S+)\s+'
    r'(?P<process>[^\[]+)'
    r'(?:\[(?P<pid>\d+)\])?:\s+'
    r'(?P<message>.*)'
)

class LogParser:
    
    def parse_line(self, line):
        match = SYSLOG_PATTERN.match(line)
        
        if match:
            data = match.groupdict()
            
            return {
                "timestamp": f"{data['month']} {data['day']} {data['time']}",
                "host": data['host'],
                "process": data['process'].strip(),
                "pid": int(data['pid']) if data["pid"] else None,
                "message": data['message'],
                "raw": line,
            }
        
        #fallback for unknown logs
        return{
            "timestamp": None,
            "host": None,
            "process": None,
            "pid": None,
            "message": line,
            "raw": line,
        }