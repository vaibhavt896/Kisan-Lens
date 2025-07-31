import requests
import sys
from datetime import datetime
import json

class AgriSageBackendTester:
    def __init__(self, base_url="https://4c18f2dc-6cb5-41b7-b364-84729c925bb8.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"   Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "api/", 200)

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        return self.run_test("Create Status Check", "POST", "api/status", 200, test_data)

    def test_get_status_checks(self):
        """Test getting all status checks"""
        return self.run_test("Get Status Checks", "GET", "api/status", 200)

    def test_frontend_accessibility(self):
        """Test if frontend is accessible"""
        return self.run_test("Frontend Accessibility", "GET", "", 200)

def main():
    print("🌱 Starting Agri-Sage Backend API Tests")
    print("=" * 50)
    
    tester = AgriSageBackendTester()
    
    # Test frontend accessibility first
    print("\n📱 Testing Frontend Accessibility...")
    tester.test_frontend_accessibility()
    
    # Test backend API endpoints
    print("\n🔧 Testing Backend API Endpoints...")
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test status check creation
    success, response = tester.test_create_status_check()
    
    # Test getting status checks
    tester.test_get_status_checks()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())