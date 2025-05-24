/**
 * Payment Form Debug Component
 * 
 * A simple debug component to test API calls and identify issues
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { propertyService, roomService, tenantService } from '@/lib/api/services';

export const PaymentFormDebug: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPropertyAPI = async () => {
    setLoading(true);
    addLog('Testing Property API...');
    
    try {
      const response = await propertyService.getProperties({
        page: 1,
        limit: 10
      });
      
      addLog(`Property API Response: ${JSON.stringify(response, null, 2)}`);
      
      if (response.statusCode === 200 && response.data) {
        setProperties(response.data.data);
        addLog(`Loaded ${response.data.data.length} properties`);
      } else {
        addLog(`Property API Error: ${response.message}`);
      }
    } catch (error) {
      addLog(`Property API Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testRoomAPI = async (propertyId: number) => {
    setLoading(true);
    addLog(`Testing Room API for property ${propertyId}...`);
    
    try {
      const response = await roomService.getRooms({
        propertyId,
        page: 1,
        limit: 10
      });
      
      addLog(`Room API Response: ${JSON.stringify(response, null, 2)}`);
      
      if (response.statusCode === 200 && response.data) {
        setRooms(response.data.data);
        addLog(`Loaded ${response.data.data.length} rooms`);
      } else {
        addLog(`Room API Error: ${response.message}`);
      }
    } catch (error) {
      addLog(`Room API Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testTenantAPI = async (propertyId: number, roomId: number) => {
    setLoading(true);
    addLog(`Testing Tenant API for property ${propertyId}, room ${roomId}...`);
    
    try {
      const response = await tenantService.getTenantsByRoom(propertyId, roomId);
      
      addLog(`Tenant API Response: ${JSON.stringify(response, null, 2)}`);
      
      if (response.statusCode === 200 && response.data) {
        setTenants(response.data);
        addLog(`Loaded ${response.data.length} tenants`);
      } else {
        addLog(`Tenant API Error: ${response.message}`);
        setTenants([]);
      }
    } catch (error) {
      addLog(`Tenant API Exception: ${error}`);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Form API Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testPropertyAPI} disabled={loading}>
              Test Property API
            </Button>
            <Button onClick={clearLogs} variant="outline">
              Clear Logs
            </Button>
          </div>

          {/* Properties */}
          {properties.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Properties:</h3>
              <div className="space-y-2">
                {properties.map(property => (
                  <div key={property.id} className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPropertyId(property.id);
                        testRoomAPI(property.id);
                      }}
                    >
                      Test Rooms for {property.propertyName}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms */}
          {rooms.length > 0 && selectedPropertyId && (
            <div>
              <h3 className="font-medium mb-2">Rooms for Property {selectedPropertyId}:</h3>
              <div className="space-y-2">
                {rooms.map(room => (
                  <div key={room.id} className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        testTenantAPI(selectedPropertyId, room.id);
                      }}
                    >
                      Test Tenants for Room {room.roomNo} (₹{room.rent})
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tenants */}
          {selectedPropertyId && selectedRoomId && (
            <div>
              <h3 className="font-medium mb-2">Tenants for Property {selectedPropertyId}, Room {selectedRoomId}:</h3>
              {tenants.length > 0 ? (
                <div className="space-y-2">
                  {tenants.map(tenant => (
                    <div key={tenant.id} className="p-2 border rounded">
                      <div>ID: {tenant.id}</div>
                      <div>User ID: {tenant.userId}</div>
                      <div>Username: {tenant.username}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">No tenants found for this room</div>
              )}
            </div>
          )}

          {/* Logs */}
          <div>
            <h3 className="font-medium mb-2">API Logs:</h3>
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-muted-foreground">No logs yet. Click "Test Property API" to start.</div>
              ) : (
                <pre className="text-xs whitespace-pre-wrap">
                  {logs.join('\n')}
                </pre>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFormDebug;
