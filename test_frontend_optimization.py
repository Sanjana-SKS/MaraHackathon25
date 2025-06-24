#!/usr/bin/env python3
"""
Test script for frontend-backend optimization integration
"""

import requests
import json

BACKEND_URL = "http://localhost:8000"

def test_optimization_data_endpoint():
    """Test the /optimization-data endpoint"""
    print("🔍 Testing /optimization-data endpoint...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/optimization-data")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data.get('message', 'No message')}")
            print(f"📊 Sites: {data['data']['sites']}")
            print(f"🔧 Devices: {data['data']['devices']}")
            print(f"⏰ Time periods: {data['data']['T']}")
            print(f"💰 Energy budget: ${data['data']['E_BUDGET']:,.2f}")
            return data['data']
        else:
            print(f"❌ Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_optimization_endpoint(optimization_data):
    """Test the /optimize endpoint"""
    print("\n🔍 Testing /optimize endpoint...")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/optimize",
            json=optimization_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success: {result.get('message', 'No message')}")
            print(f"📈 Total devices: {result.get('total_devices', 0)}")
            
            if 'optimal_allocation' in result:
                print("\n📋 Optimal Allocation:")
                for site, devices in result['optimal_allocation'].items():
                    print(f"  {site}:")
                    for device, count in devices.items():
                        if count > 0:
                            print(f"    {device}: {count} units")
            
            return result
        else:
            print(f"❌ Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_sites_endpoint():
    """Test the /sites endpoint"""
    print("\n🔍 Testing /sites endpoint...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/sites")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            sites = response.json()
            print(f"✅ Success: Found {len(sites)} sites")
            for site in sites[:3]:  # Show first 3 sites
                print(f"  - {site['name']} ({site['state']}): {site['power_capacity']}MW")
            return sites
        else:
            print(f"❌ Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def main():
    """Run all tests"""
    print("🚀 Starting Frontend-Backend Optimization Integration Tests\n")
    
    # Test 1: Get sites
    sites = test_sites_endpoint()
    
    # Test 2: Get optimization data
    optimization_data = test_optimization_data_endpoint()
    
    # Test 3: Run optimization
    if optimization_data:
        optimization_result = test_optimization_endpoint(optimization_data)
        
        if optimization_result:
            print("\n🎉 All tests passed! Backend is ready for frontend integration.")
        else:
            print("\n❌ Optimization test failed.")
    else:
        print("\n❌ Optimization data test failed.")
    
    print("\n📝 Test Summary:")
    print("- Backend URL: http://localhost:8000")
    print("- Available endpoints:")
    print("  - GET /sites - List all sites")
    print("  - GET /optimization-data - Get optimization parameters")
    print("  - POST /optimize - Run optimization")
    print("\n🔗 Frontend can now call these endpoints to perform optimization!")

if __name__ == "__main__":
    main() 