#include<bits/stdc++.h>
using namespace std;
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;

template<typename T> using ordered_set =tree<T, null_type,less<T>, rb_tree_tag,tree_order_statistics_node_update>;
//order_of_key (k) : Number of items strictly smaller than k .
//find_by_order(k) : K-th element in a set (counting from zero).
template<typename T> using ordered_multiset = tree<T, null_type,less_equal<T>, rb_tree_tag,tree_order_statistics_node_update>;
//Erase -
//if(os.upper_bound(x)!=os.end())
//    os.erase(os.upper_bound(x));
//gp_hash_table

#define ll long long
#define pb push_back
#define mp make_pair
#define F first
#define S second
#define PI 3.1415926535897932384626
#define all(x) x.begin(),x.end()
#define endl '\n'
#define MOD 1000000007

void solve() {
    int n;
    cin>>n;
    vector<int>arr(n+1),ans(n+1);
    for(int i=1;i<=n;i++)
    {
        cin>>arr[i];

    }
    sort(arr.begin()+1,arr.end());
    for(int i=2;i<=n;i++)
    {
        int val1=0,val2=0;
        for(int j=1;j<=i-1;j++)
        {
            if(arr[j]==val1)
            {
                val1++;
            }
            else
            {
                
                break;
            }
        }
        for(int j=i;j<=n;j++)
        {
            if(arr[j]==val2)
            {
                val2++;
            }
            else
            {
                
                break;
            }
        }
        if(val1==val2)
        {
            cout<<"NO"<<endl;return;
        }
    }
    
    cout<<"YES"<<endl;

}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int t = 1;
    cin >> t;
    while(t--) {
        solve();
    }
    return 0;
}