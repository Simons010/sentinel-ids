
import timeit
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ml_engine.normalization.enricher import LogEnricher

def run_benchmark(iterations=100000):
    enricher = LogEnricher()
    log = {"message": "Connection from 192.168.1.1 to 10.0.0.2 port 80 and port 443"}

    timer = timeit.Timer(lambda: enricher.enrich(log))
    time_taken = timer.timeit(number=iterations)

    print(f"Time taken for {iterations} iterations: {time_taken:.4f} seconds")
    print(f"Average time per iteration: {time_taken / iterations * 1e6:.4f} microseconds")

if __name__ == "__main__":
    run_benchmark()
