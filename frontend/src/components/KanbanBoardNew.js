import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Play,
  Archive,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Phone,
  Mail,
  Package
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://geo-site-runner.preview.emergentagent.com';

const KanbanBoardNew = ({ serviceRequests, updateServiceRequest, darkMode = false }) => {
  const [columns, setColumns] = useState([
    {
      id: 'picked_up',
      title: '📦 გატანილი',
      color: 'bg-purple-500',
      items: []
    },
    {
      id: 'pending',
      title: '⏳ მომლოდინე',
      color: 'bg-orange-500',
      items: []
    },
    {
      id: 'in_progress',
      title: '🔧 მუშავდება',
      color: 'bg-blue-500',
      items: []
    },
    {
      id: 'completed',
      title: '✅ დასრულებული',
      color: 'bg-green-500',
      items: []
    }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [manualTasks, setManualTasks] = useState([]);
  
  const [taskForm, setTaskForm] = useState({
    name: '',
    phone: '',
    email: '',
    device_type: '',
    problem_description: '',
    urgency: 'medium',
    price: '',
    started_at: '',
    completed_at: ''
  });

  useEffect(() => {
    // Load manual tasks from localStorage
    const savedTasks = localStorage.getItem('kanban_manual_tasks');
    if (savedTasks) {
      setManualTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    // Save manual tasks to localStorage
    localStorage.setItem('kanban_manual_tasks', JSON.stringify(manualTasks));
  }, [manualTasks]);

  useEffect(() => {
    // Combine service requests and manual tasks
    const allTasks = [...serviceRequests, ...manualTasks];
    
    // Group by status
    const groupedTasks = allTasks.reduce((acc, task) => {
      const status = task.status || 'pending';
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    }, {});

    // Update columns
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        items: groupedTasks[column.id] || []
      }))
    );
  }, [serviceRequests, manualTasks]);

  const handleDragStart = (e, item, columnId) => {
    setDraggedItem({ item, sourceColumn: columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.sourceColumn === targetColumnId) {
      setDraggedItem(null);
      return;
    }

    try {
      const item = draggedItem.item;
      
      // Check if it's a manual task or service request
      if (item.id && item.id.toString().startsWith('manual_')) {
        // Update manual task
        setManualTasks(prev => 
          prev.map(task => 
            task.id === item.id 
              ? { ...task, status: targetColumnId }
              : task
          )
        );
      } else {
        // Update service request via API
        await updateServiceRequest(item.id, { status: targetColumnId });
      }

      setDraggedItem(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setDraggedItem(null);
    }
  };

  const createTask = async () => {
    try {
      const newTask = {
        id: `manual_${Date.now()}`,
        case_id: `DL${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        name: taskForm.name,
        phone: taskForm.phone,
        email: taskForm.email,
        device_type: taskForm.device_type,
        problem_description: taskForm.problem_description,
        urgency: taskForm.urgency,
        price: taskForm.price ? parseFloat(taskForm.price) : null,
        started_at: taskForm.started_at || null,
        completed_at: taskForm.completed_at || null,
        created_at: new Date().toISOString(),
        status: 'pending'
      };

      setManualTasks(prev => [...prev, newTask]);

      // Reset form
      setTaskForm({
        name: '',
        phone: '',
        email: '',
        device_type: '',
        problem_description: '',
        urgency: 'medium',
        price: '',
        started_at: '',
        completed_at: ''
      });
      
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const editTask = async () => {
    try {
      const updatedTask = {
        ...editingTask,
        name: taskForm.name,
        phone: taskForm.phone,
        email: taskForm.email,
        device_type: taskForm.device_type,
        problem_description: taskForm.problem_description,
        urgency: taskForm.urgency,
        price: taskForm.price ? parseFloat(taskForm.price) : null,
        started_at: taskForm.started_at || null,
        completed_at: taskForm.completed_at || null
      };

      if (editingTask.id && editingTask.id.toString().startsWith('manual_')) {
        // Update manual task
        setManualTasks(prev => 
          prev.map(task => 
            task.id === editingTask.id ? updatedTask : task
          )
        );
      } else {
        // Update service request via API
        await updateServiceRequest(editingTask.id, updatedTask);
      }

      // Reset form
      setTaskForm({
        name: '',
        phone: '',
        email: '',
        device_type: '',
        problem_description: '',
        urgency: 'medium',
        price: '',
        started_at: '',
        completed_at: ''
      });
      
      setEditingTask(null);
      setSelectedCard(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const openEditForm = (task) => {
    setTaskForm({
      name: task.name || '',
      phone: task.phone || '',
      email: task.email || '',
      device_type: task.device_type || '',
      problem_description: task.problem_description || '',
      urgency: task.urgency || 'medium',
      price: task.price ? task.price.toString() : '',
      started_at: task.started_at ? task.started_at.split('T')[0] : '',
      completed_at: task.completed_at ? task.completed_at.split('T')[0] : ''
    });
    setEditingTask(task);
    setSelectedCard(null);
  };

  const getPriorityColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'ახლა';
    if (diffInHours < 24) return `${diffInHours} საათის წინ`;
    return `${Math.floor(diffInHours / 24)} დღის წინ`;
  };

  const KanbanCard = ({ item, columnId }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item, columnId)}
      className={`p-3 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-move mb-3 ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="text-xs font-medium">
          {item.case_id}
        </Badge>
        <Badge className={getPriorityColor(item.urgency)}>
          {item.urgency === 'critical' ? '🚨' : 
           item.urgency === 'high' ? '⚡' : 
           item.urgency === 'medium' ? '📋' : '🟢'}
        </Badge>
      </div>

      <div className="space-y-1">
        <h4 className={`font-medium text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {item.name}
        </h4>
        
        <p className={`text-xs line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {item.device_type} - {item.problem_description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {item.phone && <div className="w-2 h-2 bg-green-400 rounded-full" title="ტელეფონი"></div>}
            {item.email && <div className="w-2 h-2 bg-blue-400 rounded-full" title="ემაილი"></div>}
            {item.price && <div className="w-2 h-2 bg-yellow-400 rounded-full" title="ფასი"></div>}
          </div>
          
          <Button 
            size="sm"
            variant="ghost"
            className="text-xs px-2 py-1 h-6"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCard(item);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📋 კანბან დაფა
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            საქმეების ვიზუალური მართვა
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className={`${
              darkMode 
                ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            კალენდარი
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => setShowTaskForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            ახალი ტასკი
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {columns.map((column) => (
          <Card key={column.id} className={`p-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                <div>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {column.items.length}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {column.title.replace(/[📦⏳🔧✅]/g, '').trim()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto min-h-96">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`rounded-lg p-4 min-h-96 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {column.title}
                </h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {column.items.length}
              </Badge>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {column.items.map((item) => (
                <KanbanCard key={item.id} item={item} columnId={column.id} />
              ))}
              
              {column.items.length === 0 && (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <Plus className="h-6 w-6" />
                  </div>
                  <p className="text-sm">ცარიელია</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingTask ? 'ტასკის რედაქტირება' : 'ახალი ტასკი'}
              </h3>
              <button 
                onClick={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                  setTaskForm({
                    name: '',
                    phone: '',
                    email: '',
                    device_type: '',
                    problem_description: '',
                    urgency: 'medium',
                    price: '',
                    started_at: '',
                    completed_at: ''
                  });
                }}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>სახელი</Label>
                  <Input
                    value={taskForm.name}
                    onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    placeholder="კლიენტის სახელი"
                  />
                </div>
                <div>
                  <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>ემაილი</Label>
                  <Input
                    type="email"
                    value={taskForm.email}
                    onChange={(e) => setTaskForm({...taskForm, email: e.target.value})}
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>ტელეფონი</Label>
                  <Input
                    value={taskForm.phone}
                    onChange={(e) => setTaskForm({...taskForm, phone: e.target.value})}
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    placeholder="+995 XXX XXX XXX"
                  />
                </div>
                <div>
                  <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>ფასი</Label>
                  <Input
                    type="number"
                    value={taskForm.price}
                    onChange={(e) => setTaskForm({...taskForm, price: e.target.value})}
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>მოწყობილობის ტიპი</Label>
                  <Select value={taskForm.device_type} onValueChange={(value) => setTaskForm({...taskForm, device_type: value})}>
                    <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}>
                      <SelectValue placeholder="აირჩიეთ მოწყობილობა" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'}>
                      <SelectItem value="hdd">HDD</SelectItem>
                      <SelectItem value="ssd">SSD</SelectItem>
                      <SelectItem value="raid">RAID</SelectItem>
                      <SelectItem value="usb">USB</SelectItem>
                      <SelectItem value="sd">SD Card</SelectItem>
                      <SelectItem value="other">სხვა</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>სისწრაფე</Label>
                  <Select value={taskForm.urgency} onValueChange={(value) => setTaskForm({...taskForm, urgency: value})}>
                    <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}>
                      <SelectValue placeholder="აირჩიეთ სისწრაფე" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'}>
                      <SelectItem value="low">დაბალი</SelectItem>
                      <SelectItem value="medium">საშუალო</SelectItem>
                      <SelectItem value="high">მაღალი</SelectItem>
                      <SelectItem value="critical">კრიტიკული</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>პრობლემის აღწერა</Label>
                <Textarea
                  value={taskForm.problem_description}
                  onChange={(e) => setTaskForm({...taskForm, problem_description: e.target.value})}
                  className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  placeholder="აღწერეთ პრობლემა..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={editingTask ? editTask : createTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!taskForm.name || !taskForm.device_type}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingTask ? 'განახლება' : 'შექმნა'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                  className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}
                >
                  გაუქმება
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                საქმის დეტალები
              </h3>
              <button 
                onClick={() => setSelectedCard(null)}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    საქმის ID
                  </label>
                  <p className={`text-lg font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedCard.case_id}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    სტატუსი
                  </label>
                  <Badge className={getPriorityColor(selectedCard.urgency)}>
                    {getStatusText(selectedCard.status)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  კლიენტი
                </label>
                <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedCard.name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedCard.email}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedCard.phone}
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  მოწყობილობა
                </label>
                <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                  {selectedCard.device_type}
                </p>
              </div>
              
              {selectedCard.problem_description && (
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    პრობლემის აღწერა
                  </label>
                  <p className={`text-sm p-3 rounded ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                  }`}>
                    {selectedCard.problem_description}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => openEditForm(selectedCard)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  რედაქტირება
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  ნახვა
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function getStatusText(status) {
    const statusTexts = {
      pending: 'მომლოდინე',
      in_progress: 'მუშავდება',
      completed: 'დასრულებული',
      picked_up: 'გატანილი',
      archived: 'არქივი'
    };
    return statusTexts[status] || 'უცნობი';
  }
};

export default KanbanBoardNew;